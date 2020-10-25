const electron = require('electron')
const { app, BrowserWindow, globalShortcut } = electron
const path = require('path')
const url = require('url')

let window = null

const reload = () => window.reload()

app.once('ready', () => {
  const { width } = electron.screen.getPrimaryDisplay().workAreaSize
  window = new BrowserWindow({
    width: 750,
    height: 460,
    transparent: true,
    x: width - 750,
    y: 0,
    show: false,
    frame: false,
    icon: "./img/favicon.ico",
  })

  window.setAlwaysOnTop(true, 'screen');

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    globalShortcut.register('F5', reload);
    window.show()
  })
})
