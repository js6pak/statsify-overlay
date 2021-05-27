const fs = require('fs');
const util = require('util');
const child = require('child_process')
const fileJoin = require('path');
const python_output = util.promisify(child.execFile);
const python = child.exec;

var mostRecentSize = 0
var fileLocation;
var timesRead = 0
var lobbyMode = false;
var autoWhoed = false;

const keyCodeToKey = (key) => {
    const keys = {
        "2": "1",
        "3": "2",      
        "4": "3",
        "5": "4",
        "6": "5",
        "7": "6",
        "8": "7",
        "9": "8",
        "10":  "9",
        "11":  "0",
        "12":  "-",
        "13":  "=",
        "16":  "q",
        "17":  "w",
        "18":  "e",
        "19":  "r",
        "20":  "t",
        "21":  "y",
        "22":  "u",
        "23":  "i",
        "24":  "o",
        "25":  "p",
        "26":  "[",
        "27":  "]",
        "30":  "a",
        "31":  "s",
        "32":  "d",
        "33":  "f",
        "34":  "g",
        "35":  "h",
        "36":  "j",
        "37":  "k",
        "38":  "l",
        "39":  ";",
        "40":  "'",
        "41":  "`",
        "43":  "\\",
        "44":  "z",
        "45":  "x",
        "46":  "c",
        "47":  "v",
        "48":  "b",
        "49":  "n",
        "50":  "m",
        "51":  ",",
        "52":  ".",
        "53":  "/",
        "144": "^",
        "145": "@",
        "146": ":",
        "147": "_",
    }

    return keys[`${key}`] || 't';
}

const autoTypeWho = () => {
    var autoWhoToggle = read("autoWho")
    lobbyMode = false;
    autoWhoed = true;

    let controls = 'key_key.chat:20'
    try {
        controls = fs.readFileSync(`${app.getPath("home").replace(/\\/g, "\/")}/AppData/Roaming/.minecraft/options.txt`, {
            encoding: 'utf8'
        }) 
    } catch (e) { 
        controls = 'key_key.chat:20'
    }

    const chatKey = controls.split('\n').find(key => key.split(':')[0] === 'key_key.chat') || 'key_key.chat:20';
    const key = keyCodeToKey(chatKey.split(':')[1].trim());

    write('chatKey', key);
   
    if (autoWhoToggle && autoWhoToggle == true) {
        setTimeout(() => {
            python(
                fileJoin.join(__dirname, `python/${process.platform == 'darwin' ? "autoWho.app/Contents/MacOS/autoWho" : "autoWho/autoWho.exe"}`), 
                (err, data) => {
                    if (err) console.log(err)
                }
            );
        }, 50)
    }
}

const fixFormatting = (message) =>
    message
        .replace(/✫|✪|⚝/g, '?')
        .replace(/§|¡±/g, '�')

const clearFormatting = (message) => 
    message
        .replace(/�[0-9A-FK-OR]/gi, '')
        
const readLogFile = async () => {
    var fileData = fs.fstatSync(fileLocation);
    var newSize = fileData.size;

    if (timesRead == 0) {
        mostRecentSize = newSize
        timesRead++

        fs.watch(read("path").split("/").slice(0, -1).join("/") /* Removes '/latest.log' */, (eventType, filename) => {
            if(eventType === "rename" && filename === "latest.log") {
                fs.open((read("path")), 'r', (err, fd) => {
                    fileLocation = fd;
                    mostRecentSize = 0;
                    fileData = fs.fstatSync(fileLocation);
                    newSize = fileData.size;
                })
            }
        });

        setTimeout(readLogFile, 20)
    } else if (newSize < mostRecentSize + 1) {
        setTimeout(readLogFile, 20)
    } else {
        fs.read(fileLocation, Buffer.alloc(2056), 0, 2056, mostRecentSize, (err, bytecount, buff) => {
            mostRecentSize += bytecount

            const lines = buff.toString().split(/\r?\n/).slice(0, -1);
            lines.forEach(line => processLine(line))
            readLogFile()
        });
    }
}

const processLine = async line => {
    if (!line.includes('[Client thread/INFO]: [CHAT]') && !line.includes('[main/INFO]: [CHAT]')) return;

    line = fixFormatting(line);
    clearLine = clearFormatting(line)

    if (clearLine.includes("Sending you to mini") || clearLine.includes("[CHAT]        ") /*|| clearLine.includes("[CHAT]                                      ") || clearLine.includes([CHAT]                 "*/) {
        autoWhoed = false;
        if (lobbyMode == false) {
            resetPlayers()
            resetCache()
        }
    } else if (clearLine.includes(" has joined (")) {
        var player = clearLine.split(" [CHAT] ")[1].split(" has joined")[0]
        addPlayer(player)
        lobbyMode = false;
        if (autoWhoed == false) autoTypeWho()
    } else if (clearLine.includes(" has quit!")) {
        lobbyMode = false;
        var player = clearLine.split(" [CHAT] ")[1].split(" has quit!")[0]
        removePlayer(player)
        if (autoWhoed == false) autoTypeWho()
    } else if (clearLine.includes(" ONLINE: ")) {
        var players = clearLine.split(" [CHAT] ONLINE: ")[1].split(", ")
        resetPlayers()
        players.forEach((player, i) => addPlayer(player, i == players.length-1 || i  % rNum(1, 2) === 0 ? true : false))
    } else if (clearLine.includes("Online Players(")) {
        lobbyMode = true;
        resetPlayers()

        var players = clearLine.split(" [CHAT] Online Players(");
        players.shift()
        players = players[0].split(", ")

        addPlayers(players.map(p => p.split(" ")[p.split(" ").length - 1]));
    } else if (clearLine.toLowerCase().includes(" can't find a player by the name of '.hide'") || clearLine.toLowerCase().includes(" can't find a player by the name of '.h'")) {
        hideWindow()
    } else if (clearLine.toLowerCase().includes(" can't find a player by the name of '.show'") || clearLine.toLowerCase().includes(" can't find a player by the name of '.s'")) {
        showWindow(true)
    } else if (clearLine.toLowerCase().includes(" can't find a player by the name of '.clear'") || clearLine.toLowerCase().includes(" can't find a player by the name of '.c'")) {
        resetPlayers()
        resetCache()
    } else if (clearLine.includes(" Can't find a player by the name of '.")) {
        var player = clearLine.split(" Can't find a player by the name of '")[1]
        addPlayer(parseCompactChat(player, ".", '\''))
    } else if (read("partyEnabled") && clearLine.split(" [CHAT] ")[1].match(/\S*(?=( to the party! They have 60 seconds to accept.))/)) { // Invite (In Party)
        var player = clearLine.split(" [CHAT] ")[1].match(/\S*(?=( to the party! They have 60 seconds to accept.))/)[0];

        addPlayer(player)
    } else if (read("partyEnabled") && line.split(" [CHAT] ")[1].match(/\S*(?=( party!))/)) { // You Joining Party (Out of Party)
        var player = line.split(" [CHAT] ")[1].match(/\S*(?=('))/)[0];

        addPlayer(player)
    } else if (read("partyEnabled") && line.split(" [CHAT] ")[1].match(/\S*(?=( joined the party.))/)) { // Someone Joining Party (Out of Party)
        var player = line.split(" [CHAT] ")[1].match(/\S*(?=( joined the party.))/)[0];

        addPlayer(player)
    } else if (read("partyEnabled") && line.split(" [CHAT] ")[1].match(/Party Leader: (\S.*)/) && line.split(" [CHAT] ")[1].match(/Party Leader: (\S.*)/).length == 2) { // Party List (Leader)
        var player = line.split(" [CHAT] ")[1].match(/(?<=\: )(.*?)(?= \?)/)
        player = player[0].split(" ");

        addPlayer(player[player.length - 1]);
    } else if (read("partyEnabled") && line.split(" [CHAT] ")[1].match(/Party Moderators: (\S.*)/) && line.split(" [CHAT] ")[1].match(/Party Moderators: (\S.*)/).length == 2) { // Party List (Moderators)
        var players = line.split(" [CHAT] ")[1].replace("Party Moderators: ", "").replace(/\[(.*?)\]/g, '');
        players = players.split(" ?");
        players.pop()
        addPlayers(players.map(p => p.replace(/ /g, "")))
    } else if (read("partyEnabled") && line.split(" [CHAT] ")[1].match(/Party Members: (\S.*)/) && line.split(" [CHAT] ")[1].match(/Party Members: (\S.*)/).length == 2) { // Party List (Members)
        var players = line.split(" [CHAT] ")[1].replace("Party Members: ", "").replace(/\[(.*?)\]/g, '');
        players = players.split(" ?");
        players.pop()

        addPlayers(players.map(p => p.replace(/ /g, "")));
    } else if (read("partyEnabled") && line.split(" [CHAT] ")[1].match(/You'll be partying with: (\S.*)/)) { // Party Group Join (Out of Party)
        var players = line.split(" [CHAT] ")[1].replace("You'll be partying with: ", '').replace(/and \d* other players!/, "").replace(/\[(.*?)\]/g, '');
        players = players.split(", ");

        addPlayers(players.map(p => p.replace(/ /g, "")));
    } else if (line.split(" [CHAT] ")[1].match(/\S+(?=\:)/) && (read("lobbyEnabled") || false) == true) {
        if (line.split(" [CHAT] ")[1].includes("�2Guild > ") || line.split(" [CHAT] ")[1].includes("�9Party �8> ") || !line.split(" [CHAT] ")[1].replace(/�(\S)/g, '').includes("?] ")) return
        var player = line.split(" [CHAT] ")[1]
        player = player.match(/\S+(?=\:)/);
        player = player[0].replace(/�\S/g, '');

        addPlayer(player)
    } else if (clearLine.includes("[CHAT] Your new API key is ")) {
        var key = clearLine.split("[CHAT] Your new API key is ")[1];
        document.getElementById("apiKeyField").value = key;
        write("api", key);
    }
}

const parseCompactChat = (line, startChar, endChar) => {
    newLine = line;
    newLine = newLine.split(endChar)[0]
    newLine = newLine.replace(startChar, "")

    return newLine
}

const readLogs = () => {
    fs.open((read("path")), 'r', (err, fd) => {
        fileLocation = fd
        readLogFile()
    })
}

const getFileAccessDate = path => {
    try {
        var stats = fs.statSync(path)
    } catch {
        return null
    }

    if (!stats) return null
    return stats.mtimeMs
}

if (read("path")) {
    if (read("path") === `${app.getPath("home").replace(/\\/g, "\/")}/.lunarclient/offline/files/1.8/logs/latest.log`) {
        write("path", `${app.getPath("home").replace(/\\/g, "\/")}/.lunarclient/offline/1.8/logs/latest.log`)
    }

    readLogs()
} else {
    var logFiles = [
        { name: "lunar", path: `/.lunarclient/offline/1.8/logs/` },
        { name: "vanilla", path: `/AppData/Roaming/.minecraft/logs/` },
        { name: "badlion", path: `/AppData/Roaming/.minecraft/logs/blclient/minecraft/` },
        { name: "pvplongue", path: `/AppData/Roaming/.pvplounge/logs/` }
    ]
    
    if (process.platform == 'darwin') {     
        logFiles = [
            { name: "lunar", path: `/.lunarclient/offline/1.8/logs/` },
            { name: "vanilla", path: `/Library/Application Support/minecraft/logs/` },
            { name: "badlion", path: `/Library/Application Support/minecraft/logs/blclient/minecraft/` },
        ]
    }

    logFiles = logFiles.sort((a, b) => {
        b.time = getFileAccessDate(`${app.getPath("home").replace(/\\/g, "\/")}${a.path}latest.log`) || null
        a.time = getFileAccessDate(`${app.getPath("home").replace(/\\/g, "\/")}${b.path}latest.log`) || null

        return a.time - b.time
    })

    if (logFiles[0].time) {
        write("path", `${app.getPath("home").replace(/\\/g, "\/")}${logFiles[0].path}latest.log`)
        switch (logFiles[0].name) {
            case "lunar":
                document.getElementById("lcOption").selected = "selected"
                break;
            case "vanilla":
                document.getElementById("vfOption").selected = "selected"
                break;
            case "badlion":
                document.getElementById("bcOption").selected = "selected"
                break;
            case "pvplongue":
                document.getElementById("plcOption").selected = "selected"
                break;
        }

        readLogs()

    } else toggleMenu()
}