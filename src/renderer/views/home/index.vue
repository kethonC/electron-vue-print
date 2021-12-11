<template>
  <div>
    <el-form>
      <el-form-item label="打印机列表">
        <el-select v-model="selectedPrinterName">
          <el-option
            v-for="item of printerList"
            :key="item.name"
            :value="item.name"
            :title="item.name"
          >
          </el-option>
        </el-select>
        <el-button @click="print">打印</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import { printTemplateHtml } from '@/utils/printTemplate'
import { getBase64 } from '@/utils/imageUtil'
export default {
  data() {
    return {
      dialogVisible: false,
      printerList: [],
      selectedPrinterName: '',
      imageBase64: ''
    }
  },
  mounted() {
    this.getPrinters()
    ipcRenderer.on('get-printers', (event, list) => {
      console.log('list', list)
      this.printerList = list
      this.dialogVisible = true
    })
    this.getImageBase64()
  },
  methods: {
    async getImageBase64() {
      this.imageBase64 = await getBase64('https://gitee.com/static/images/logo-black.svg')
    },
    getPrinters() {
      ipcRenderer.send('get-printers')
    },
    async print() {
      const tempalteHtml = printTemplateHtml([
        {
          type: 'text',
          value: '商家联',
          style: {
            fontSize: 24,
            fontWeight: 'bolder'
          }
        },
        {
          type: 'text',
          value: '***#51 美团外卖 ***',
          style: {
            fontSize: 24,
            fontWeight: 'bolder',
            textAlign: 'center'
          }
        },
        {
          type: 'empty',
          value: 4
        },
        {
          type: 'text',
          value: '* 麦当劳（南昌凤凰中大道餐厅）*',
          style: {
            textAlign: 'center'
          }
        },
        {
          type: 'empty',
          value: 2
        },
        {
          type: 'text',
          value: '--已在线支付--',
          style: {
            fontSize: 24,
            fontWeight: 'bolder',
            textAlign: 'center'
          }
        },
        {
          type: 'empty',
          value: 2
        },
        {
          type: 'dash-line',
          value: 2
        },
        {
          type: 'text',
          value: '期望到达时间：立即送餐'
        },
        {
          type: 'text',
          value: '下单时间： 2021-12-11 12:37:50'
        },
        {
          type: 'text',
          value: '订单编号：5897447745258588'
        },
        {
          type: 'empty',
          value: 4
        },
        {
          type: 'text',
          value: '测试打印',
          style: {
            fontSize: 18,
            fontWeight: 'bolder'
          }
        },
        {
          type: 'empty',
          value: 8
        },
        {
          type: 'line',
          value: 2
        },
        {
          type: 'empty',
          value: 2
        },
        {
          type: 'dash-line',
          value: 2
        },
        {
          type: 'row',
          value: [{
            value: '商品',
            style: {
              flex: 2
            }
          },
          {
            value: '数量',
            style: {
              flex: 1
            }
          },
          {
            value: '价格',
            style: {
              flex: 1
            }
          }]
        },
        {
          type: 'dash-line',
          value: 2
        },
        {
          type: 'rows',
          value: [
            {
              value: [{
                value: '薯条（大）',
                style: {
                  flex: 2
                }
              },
              {
                value: 'x1',
                style: {
                  flex: 1
                }
              },
              {
                value: '11.00',
                style: {
                  flex: 1
                }
              }]
            },
            {
              value: [{
                value: '可口可乐（中杯）',
                style: {
                  flex: 2
                }
              },
              {
                value: 'x2',
                style: {
                  flex: 1
                }
              },
              {
                value: '11.00',
                style: {
                  flex: 1
                }
              }]
            }
          ],
          style: {
            fontSize: 14,
            fontWeight: 'bolder'
          }
        },
        {
          type: 'empty',
          value: 2
        },
        {
          type: 'dash-line',
          value: 2
        },
        {
          type: 'keyvalue',
          title: '合计',
          value: '20000'
        },
        {
          type: 'keyvalue',
          title: '应收',
          value: '20000'
        },
        {
          type: 'qr-code',
          value: '123'
        },
        {
          type: 'image',
          value: this.imageBase64
        }
      ])
      // ipcRenderer.send('do-print', {
      //   html: '<div style="height: 20px; width: 100%;">测试打印</div>'
      // })
      ipcRenderer.send('do-print', {
        printerName: this.selectedPrinterName,
        html: tempalteHtml
      })
    }
  }
}
</script>