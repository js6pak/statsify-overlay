/* Drop down menu for picking what client logs to use */
var path = read("path")
if (path) {
    if (path.includes("blclient")) document.getElementById("bcOption").selected = "selected"
    else if (path.includes("lunarclient")) document.getElementById("lcOption").selected = "selected"
    else if (path.includes("pvplounge")) document.getElementById("plcOption").selected = "selected"
    else document.getElementById("vfOption").selected = "selected"
}

const clientSwitcher = () => {
    var client = document.getElementById("logMode").value
    var path = app.getPath("home").replace(/\\/g, "\/");
    if (client == "vf") path += "/AppData/Roaming/.minecraft/logs/";
    else if (client == "bc") path += "/AppData/Roaming/.minecraft/logs/blclient/minecraft/";
    else if (client == "lc") path += "/.lunarclient/offline/1.8/logs/";
    else if (client == "plc") path += "/AppData/Roaming/.pvplounge/logs/";

    if (process.platform === 'darwin') {
        path = app.getPath("home").replace(/\\/g, "\/");
        if (client == "vf") path += `/Library/Application Support/minecraft/logs/`
        else if (client == "bc") path += `/Library/Application Support/minecraft/logs/blclient/minecraft/`
        else if (client == "lc") path += `/.lunarclient/offline/1.8/logs/`
    }

    path += "latest.log"

    fs.open(path, 'r', (err, fd) => {
        if (!fd) {
            return sendHeader("There is no log file associated with that client. Try manually selecting the log file.", false)
        } else {
            sendHeader("Your log file has been switched. Refreshing for these changes to take place...", true)
            write("path", path)

            setTimeout(() => {
                var window = remote.getCurrentWindow()
                window.reload()
            }, 3250)
        }
    })
}