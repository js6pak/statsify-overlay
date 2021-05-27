/* Button to open file explorer to set custom log path for overlay to read */
const customPathSubmitter = () => {
    var options = {
        title: 'Select the \'latest.log\' file you wish to use.',
        buttonLabel: 'Select',
        filters: [{ name: 'Log Files', extensions: ['log'] }],
        properties: ['openFile']
    }

    if (process.platform !== 'darwin') options.properties.push('OpenDirectory')

    dialog.showOpenDialog(options, filePath_obj => {
        if (filePath_obj) {
            sendHeader("Your log file has been switched. Refreshing for these changes to take place...", true)
            write('path', filePath_obj[0].replace(/\\/g, "\/"))

            setTimeout(() => {
                var window = remote.getCurrentWindow()
                window.reload()
            }, 3250)
        }
    });
}