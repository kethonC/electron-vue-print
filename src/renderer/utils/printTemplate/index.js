import qr from 'qr-image'
// 打印文本 value为文本内容
const printText = (item) => {
  return `<div style='${getItemStyle(item.style)}'>${item.value || ''}</div>`
}
// 打印空行 value为行数 1行10px
const printEmpty = (item) => {
  const height = 10 * (item.value || 1)
  const cssStyle = `height:${height}px`
  return `<div style="${cssStyle}"></div>`
}
const printKeyvalue = (item) => {
  return `<div class="flex-between" style='${getItemStyle(item.style)}'><div>${item.title || ''}</div><div>${item.value || ''}</div></div>`
}
// 打印虚线行
const printDashLine = (item) => {
  return `<hr style="border: 1px dashed rgab(0, 0, 0, 0.9)"></hr>`.repeat(item.value || 1)
}
// 打印实线行
const printLine = (item) => {
  return `<hr style="border: 1px solid rgab(0, 0, 0, 1)"></hr>`.repeat(item.value || 1)
}
// 打印行
const printRow = (item) => {
  let html = ''
  const arr = item.value
  for (let i = 0; i < arr.length; i++) {
    const itemHtml = `<div style="flex:1;text-align:${i === 0 ? 'left' : 'right'};${getItemStyle(arr[i].style)}">${arr[i].value}</div>`
    html += itemHtml
  }
  return `<div class="flex">${html}</div>`
}
const printRows = (item) => {
  let html = ''
  if (!Array.isArray(item.value) || item.value.length === 0) {
    return html
  }
  for (let rowItem of item.value) {
    rowItem.style = rowItem.style || item.style
    html += printRow(rowItem)
  }
  return html
}
// 打印二维码
const printQrCode = (item) => {
  if (!item.value) {
    return ''
  }
  const buffer = qr.imageSync(item.value, {
    type: 'png'
  })
  const base64 = buffer.toString('base64')
  const style = item.style || {}
  if (!style.width) {
    style.width = '70vw'
  }
  if (!style.height) {
    style.height = '70vw'
  }
  return `<div class="flex-center"><img ${getItemStyle(style)} src="data:image/png;base64,${base64}"/></div>`
}
// 打印图片
const printImage = (item) => {
  if (!item.value) {
    return ''
  }
  const style = item.style || {}
  if (!style.width) {
    style.width = '70vw'
  }
  if (!style.height) {
    style.height = '70vw'
  }
  const html = `<div class="flex-center"><img style="${getItemStyle(style)}" src="${item.value}"/></div>`
  return html
}
const printItem = (item) => {
  switch (item.type) {
    case 'text':
      return printText(item)
    case 'empty':
      return printEmpty(item)
    case 'keyvalue':
      return printKeyvalue(item)
    case 'line':
      return printLine(item)
    case 'dash-line':
      return printDashLine(item)
    case 'row':
      return printRow(item)
    case 'rows':
      return printRows(item)
    case 'qr-code':
      return printQrCode(item)
    case 'image':
      return printImage(item)
  }
}
// 打印的样式，支持 fontSize、fontWeight、textAlign、height、width
const getItemStyle = (style) => {
  if (!style) return ''
  const styleArray = []
  for (let [key, value] of Object.entries(style)) {
    let cssStyle
    switch (key) {
      case 'fontSize':
        cssStyle = `font-size: ${value || 0}px`
        break
      case 'fontWeight':
        cssStyle = `font-weight: ${value}`
        break
      case 'textAlign':
        cssStyle = `text-align: ${value}`
        break
      case 'height':
        cssStyle = `height: ${value}`
        break
      case 'lineHeight':
        cssStyle = `line-height: ${value}`
        break
      case 'width':
        cssStyle = `width: ${value}`
        break
      case 'flex':
        cssStyle = `flex: ${value}`
        break
    }
    if (cssStyle) {
      styleArray.push(cssStyle)
    }
  }
  const resStyle = styleArray.join(';')
  return resStyle
}
export function printTemplateHtml(template) {
  let result = ''
  if (!Array.isArray(template) || template.length === 0) {
    return result
  }
  for (let item of template) {
    const itemHtml = printItem(item)
    result = result.concat(itemHtml)
  }
  return result
}
