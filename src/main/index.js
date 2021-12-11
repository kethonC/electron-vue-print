'use strict'

import path from 'path'
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
const electron = require('electron')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9081`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1200,
    height: 768,
    minWidth: 1200,
    minHeight: 675,
    show: true,
    center: true,
    webPreferences: {
      webSecurity: false
    }
  })
  // 隐藏菜单栏
  Menu.setApplicationMenu(null)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
    if (printWindow) {
      printWindow.close()
    }
  })
  createPrintWindow()
}

app.on('ready', createWindow)

app.on('will-quit', function () {
  electron.globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
// 打印窗体
let printWindow
function createPrintWindow() {
  printWindow = new BrowserWindow({
    show: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const fileUrl = path.join(__static, 'printer.html')
  printWindow.loadFile(fileUrl)
  initPrinters()
}
function initPrinters() {
  // 获取打印机列表
  ipcMain.on('get-printers', (event, data) => {
    const printers = printWindow.webContents.getPrinters()
    mainWindow.webContents.send('get-printers', printers)
  })
  // 获取渲染进程传递过来的打印指令
  ipcMain.on('do-print', (event, data) => {
    const list = mainWindow.webContents.getPrinters()
    const defaultPrinter = list.find(x => x.status === 0 && x.isDefault)
    const dataResult = {
      html: data.html,
      deviceName: data.printerName || defaultPrinter.name
    }
    printWindow.webContents.send('render-print', dataResult)
  })
  // 从printer.html传递过来的指令
  ipcMain.on('print-do', (e, data) => {
    printWindow.webContents.print({
      silent: true,
      printBackground: false,
      deviceName: data
    })
  })
}
