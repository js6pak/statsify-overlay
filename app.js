const electron = require('electron')
const { app, BrowserWindow } = electron
const Store = require('electron-store');
const path = require('path')
const url = require('url')

if (require('electron-squirrel-startup')) return app.quit();

require('@electron/remote/main').initialize();
Store.initRenderer();

app.commandLine.appendSwitch('enable-transparent-visuals');

if (process.platform === "linux") {
    app.commandLine.appendSwitch('disable-gpu');
}

const spawnWindow = () => {
    const { width } = electron.screen.getPrimaryDisplay().workAreaSize
    const window = new BrowserWindow({
        width: 750,
        height: 460,
        minWidth: 500,
        transparent: true,
        x: width - 750,
        y: 23,
        show: false,
        frame: false,
        icon: path.join(__dirname, "img", process.platform === "win32" ? "favicon.ico" : "statsify.png"),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    window.setAlwaysOnTop(true, 'floating');
    window.setVisibleOnAllWorkspaces(true);

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    window.once('ready-to-show', () => window.show())
};

app.once('ready', () => setTimeout(spawnWindow, process.platform === "linux" ? 500 : 0));