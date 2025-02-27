const { dialog } = require("@electron/remote");

/* Button to open file explorer to set custom log path for overlay to read */
const customPathSubmitter = () => {
    const options = {
        title: 'Select the \'latest.log\' file you wish to use.',
        buttonLabel: 'Select',
        filters: [{ name: 'Log Files', extensions: ['log'] }],
        properties: ['openFile']
    };

    if (process.platform === 'win32') options.properties.push('OpenDirectory')

    dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
            sendHeader("Your log file has been switched. Refreshing for these changes to take place...", true)
            write('path', result.filePaths[0].replace(/\\/g, "\/"))

            setTimeout(() => {
                var window = remote.getCurrentWindow()
                window.reload()
            }, 3250)
        }
    });
}