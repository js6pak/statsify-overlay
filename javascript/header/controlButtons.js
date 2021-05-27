const remote = require('@electron/remote')

const closeWindow = () => {
    window.close();
    process.exit()
}

var maximized = false;

const maximizeWindow = () => {
    document.getElementById("body").classList.remove("hidden");

    var window = remote.getCurrentWindow()
    if (!maximized) {
        window.maximize()
        maximized = true;
    } else {
        maximized = false;
        window.unmaximize()
    }
}

const minimizeWindow = () => {
    var window = remote.BrowserWindow.getFocusedWindow();
    window.minimize();
}

const hideWindow = (showNotification) => {
    if (showNotification == undefined) showNotification = true;

    if (read("notifications") && showNotification) {
        const hideNotif = new Notification('Statsify', {
            body: 'Overlay has been hidden.\nType \'/w .show\' to show it again.',
            icon: './img/statsify.png',
            silent: true
        });
    }

    var window = remote.getCurrentWindow();
    window.hide()

}

const showWindow = (forceShown = false) => {
    var window = remote.getCurrentWindow();
    if (window.isVisible() == false) window.showInactive()
    if (forceShown) tableUpdater()
}

const resetWindow = () => {
    var window = remote.getCurrentWindow();
    window.setSize(750, 460);

    resetPlayers()
    resetCache()
}
