var cachedPlayers = {}
var currentPlayers = {}
var cachedUUIDs = {}
var adding = []
var cachedGuilds = new Map()

const addPlayer = async (player, update = true) => {
  player = player.replace(/ /gm, '');

  if (player in currentPlayers || adding.includes(player)) return;
  else if (player in cachedPlayers) currentPlayers[player] = cachedPlayers[player]
  else if (cachedUUIDs[player] === 'nicked') currentPlayers[player] = { error: true, exists: false, username: player, sniper: { sniper: false } }
  else {
    adding.push(player)
    var playerObj = await getPlayer(cachedUUIDs[player] || player, player)

    if (playerObj.repeat) {
      var u = await getUUID(player)
      if (!u.uuid) playerObj = await getPlayer(player)
      else playerObj = await getPlayer(u.uuid, u.username)
    }

    if (read("guildEnabled") && !playerObj.error && playerObj.uuid) playerObj.guild = (cachedGuilds.get(playerObj.uuid) || await getGuild(playerObj.uuid));
    if (playerObj.uuid && !playerObj.error) cachedUUIDs[player] = playerObj.uuid
    else if (playerObj.error && playerObj.exists == false) {
      cachedUUIDs[player] = "nicked"
    }

    cachedPlayers[player] = playerObj
    currentPlayers[player] = playerObj
    adding = adding.filter(u => u !== player);
  }

  if (update) tableUpdater()
}

const addPlayers = async players => {
  await Promise.all(players.map(async (player) => {
    await addPlayer(player, false);
  }));

  tableUpdater()
}

const resetPlayers = async () => {
  currentPlayers = {}
  tableUpdater()
}

const resetCache = async () => {
  cachedPlayers = {}
  tableUpdater()
}

const removePlayer = async player => {
  if (!player in currentPlayers) return;
  delete currentPlayers[player]
  tableUpdater()
}

const removePlayers = async players => {
  players.forEach(player => {
    if (!player in currentPlayers) return;
    delete currentPlayers[player]
    delete cachedPlayers[player];
  })

  tableUpdater()
}

//

var erroredPlayers = [];
schedule.scheduleJob('1 * * * * *', function () {
  if (erroredPlayers.length) removePlayers(erroredPlayers);
  erroredPlayers = [];
});

//

const mouseCoords = {
  x: 0,
  y: 0,
  height: 0
}

document.addEventListener('mousemove', e => {
  mouseCoords.x = e.pageX;
  mouseCoords.y = e.pageY;
  mouseCoords.height = document.body.scrollHeight
})

const makeTooltip = (index, text, html) => {
  return `<div class="tooltip">${text}<span class="tooltiptext" style="margin-top: ${mouseCoords.y > remote.getCurrentWindow().getSize()[1] ? 500 : -24 * index}px">${html}</span></div>`
  //return `<div class="tooltip">${text}<span class="tooltiptext" style="margin-top: ${mouseCoords.y + 150 >= mouseCoords.height ? -100 : -10}px">${html}</span></div>`
}

const getThreatColor = score => {
  var colors = read("index_color")

  var index = colors.findIndex(({ rating }, index, arr) => score >= rating && ((arr[index + 1] && score < arr[index + 1].rating) | !arr[index + 1]))
  return `§#${colors[index <= -1 ? 0 : index].color}`;
}

var timeOut;
const verified = read("verified") || [];
const devs = [
  "e3b17fc96e5b437a9c88a84dc6adaa39",
  "618a96fec8b0493fa89427891049550b",
  "20aa2cf67b7443a093b5f3666c160f5f",
  "96f645ba026b4e45bc34dd8f0531334c",
  "f34f414794774b22a41b5d34c9abb36c",
  "763af567bb54492eb3e35bc89b19b43b"
]

const tableUpdater = async () => {
  var mode = read("mode") || "overall"
  showWindow()

  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    var hideMode = read("autoHide")
    if (document.getElementById("menu").classList.contains("hidden") && document.getElementById("faq-tooltip").classList.contains("hidden")) {
      if (hideMode == undefined || hideMode == true) hideWindow()
    }
  }, read("autoHide_hideAfter"))

  const table = document.getElementById("playerTable");
  table.innerHTML = ``;

  var objectValues = Object.values(currentPlayers)
  var sortMode = read("sort") || "threat"
  objectValues = objectValues.sort((a, b) => {
    if (sortMode == "threat") {
      var aLevel = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars : {}).level != undefined ? (a.stats ? a.stats.bedwars : {}).level : Infinity
      var bLevel = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars : {}).level != undefined ? (b.stats ? b.stats.bedwars : {}).level : Infinity
      
      var aFKDR = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars[mode] : {}).fkdr != undefined ? (a.stats ? a.stats.bedwars[mode] : {}).fkdr : Infinity
      var bFKDR = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars[mode] : {}).fkdr != undefined ? (b.stats ? b.stats.bedwars[mode] : {}).fkdr : Infinity
      
      a.threatIndex = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (aLevel * (aFKDR * aFKDR)) / 10
      b.threatIndex = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (bLevel * (bFKDR * bFKDR)) / 10

      return (read("appearance_sort") == true ? a.threatIndex - b.threatIndex : b.threatIndex - a.threatIndex)
    } else if (sortMode == "level") {
      var aLevel = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars : {}).level != undefined ? (a.stats ? a.stats.bedwars : {}).level : Infinity
      var bLevel = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars : {}).level != undefined ? (b.stats ? b.stats.bedwars : {}).level : Infinity

      return (read("appearance_sort") == true ? aLevel - bLevel : bLevel - aLevel)
    } else if (sortMode == "hLevel") {
      var ahLevel = a.sniper.sniper && read("appearance_sniper") ? 1e100 : a.level || Infinity
      var bhLevel = b.sniper.sniper && read("appearance_sniper") ? 1e100 : b.level || Infinity

      return (read("appearance_sort") == true ? ahLevel - bhLevel : bhLevel - ahLevel)
    } else if (sortMode == "fkdr") {
      var aFKDR = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars[mode] : {}).fkdr != undefined ? (a.stats ? a.stats.bedwars[mode] : {}).fkdr : Infinity
      var bFKDR = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars[mode] : {}).fkdr != undefined ? (b.stats ? b.stats.bedwars[mode] : {}).fkdr : Infinity
      
      return (read("appearance_sort") == true ? aFKDR - bFKDR : bFKDR - aFKDR)
    } else {
      var aWS = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars[mode] : {}).winstreak || 0
      var bWS = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars[mode] : {}).winstreak || 0

      return (read("appearance_sort") == true ? aWS - bWS : bWS - aWS)
    }
    
    /*var aLevel = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars : {}).level != undefined ? (a.stats ? a.stats.bedwars : {}).level : Infinity
    var bLevel = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars : {}).level != undefined ? (b.stats ? b.stats.bedwars : {}).level : Infinity

    var ahLevel = a.sniper.sniper && read("appearance_sniper") ? 1e100 : a.level || Infinity
    var bhLevel = b.sniper.sniper && read("appearance_sniper") ? 1e100 : b.level || Infinity

    var aFKDR = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars[mode] : {}).fkdr != undefined ? (a.stats ? a.stats.bedwars[mode] : {}).fkdr : Infinity
    var bFKDR = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars[mode] : {}).fkdr != undefined ? (b.stats ? b.stats.bedwars[mode] : {}).fkdr : Infinity

    var aWS = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (a.stats ? a.stats.bedwars[mode] : {}).winstreak || 0
    var bWS = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (b.stats ? b.stats.bedwars[mode] : {}).winstreak || 0

    a.threatIndex = a.sniper.sniper && read("appearance_sniper") ? 1e100 : (aLevel * (aFKDR * aFKDR)) / 10
    b.threatIndex = b.sniper.sniper && read("appearance_sniper") ? 1e100 : (bLevel * (bFKDR * bFKDR)) / 10

    var sortMode = read("sort") || "threat"

    if (sortMode == "threat") return (read("appearance_sort") == true ? a.threatIndex - b.threatIndex : b.threatIndex - a.threatIndex)
    else if (sortMode == "level") return (read("appearance_sort") == true ? aLevel - bLevel : bLevel - aLevel)
    else if (sortMode == "hLevel") return (read("appearance_sort") == true ? ahLevel - bhLevel : bhLevel - ahLevel)
    else if (sortMode == "fkdr") return (read("appearance_sort") == true ? aFKDR - bFKDR : bFKDR - aFKDR)
    else return (read("appearance_sort") == true ? aWS - bWS : bWS - aWS)*/
  })

  const headers = table.insertRow();
  headers.innerHTML = `
  ${read("appearance_row") ? `<th class="indexRow"></th>` : ``}
  <th class="iconRow"></th>
  <th></th>
  <th class="tableHeader">PLAYER</th>
  ${read('table_customTable').filter(o => o.displayValue != '').map(o => `<th class='tableHeader'>${(o.displayValue).toUpperCase()}</th>`).join('')}`

  objectValues.forEach(async (player, index) => {
    if (read("appearance_sort") == false ? index >= read('appearance_playerLimit') : false) return
    var row = table.insertRow(index + 1);

    var indexColoumn = row.insertCell(0);
    indexColoumn.classList.add('indexRow');
    indexColoumn.classList.add('hidden');
    indexColoumn.innerHTML = mcColor(`§s${index + 1}.`);

    var icon = row.insertCell(1);
    icon.classList.add('iconRow');

    var head = row.insertCell(2);
    head.classList.add('headRow')

    var name = row.insertCell(3);
    name.classList.add('IGN');

    const rows = []
    var count = 0;
    read('table_customTable').forEach((item, index) => {
      if (item.value == 'none') return;
      rows[count] = row.insertCell(count + 4);
      count++
    })

    var partyMembers = {};

    icon.innerHTML = `<img class="playerBadge" src="img/icons/blank.png">`

    if (read("appearance_icon")) document.querySelectorAll('.iconRow').forEach(element => element.classList.add('hidden'));
    if (read("appearance_row")) document.querySelectorAll('.indexRow').forEach(element => element.classList.remove('hidden'));

    if (player.exists == false) {
      name.innerHTML = mcColor(`§7${player.username}`)
      read('table_customTable').forEach((item, index) => {
        if (item.value == 'tag') {
          rows[index].innerHTML = mcColor(`§4${read('appearance_tag') ? "N" : "NICKED"}`)
        };
      })

      head.innerHTML = `<img src="img/icons/warn.png"; class="skull";></img>`
    } else if (player.outage) {
      name.innerHTML = mcColor(`§8${player.username || "Error"} - §cHypixel API Outage`);
      head.innerHTML = `<img src="https://minotar.net/helm/${player.username}/16.png"; class="skull";></img>`
      erroredPlayers.push(player.username);
      return
    } else if (player.throttle) {
      name.innerHTML = mcColor(`§8${player.username || "Error"} - §cKey Throttle`);
      head.innerHTML = `<img src="https://minotar.net/helm/${player.username}/16.png"; class="skull";></img>`
      erroredPlayers.push(player.username);
      return
    } else if (player.invalid) {
      name.innerHTML = mcColor(`§8${player.username || "Error"} - §cInvalid API Key, run §f/api new`);
      head.innerHTML = `<img src="https://minotar.net/helm/${player.username}/16.png"; class="skull";></img>`
      erroredPlayers.push(player.username);
      return
    } else if (player.repeat) {
      name.innerHTML = mcColor(`§8${player.username || "Error"} - §4Checked too Recently!`);
      head.innerHTML = `<img src="https://minotar.net/helm/${player.username}/16.png"; class="skull";></img>`
      return
    } else {
      var Level = (player.stats ? player.stats.bedwars : {}).level != undefined ? (player.stats ? player.stats.bedwars : {}).level : Infinity
      var FKDR = (player.stats ? player.stats.bedwars[mode] : {}).fkdr != undefined ? (player.stats ? player.stats.bedwars[mode] : {}).fkdr : Infinity
      player.threatIndex = (Level * FKDR * FKDR) / 10
      var threatColor = getThreatColor(player.threatIndex);

      const formattedPlayer = {
        tag: '',
        i: mcColor(`${threatColor}${player.threatIndex.toFixed(2)}`),
        ws: mcColor(`${threatColor}${player.stats.bedwars[mode].winstreak.toLocaleString()}`),
        w: mcColor(`${threatColor}${player.stats.bedwars[mode].wins.toLocaleString()}`),
        l: mcColor(`${threatColor}${player.stats.bedwars[mode].losses.toLocaleString()}`),
        wlr: mcColor(`${threatColor}${player.stats.bedwars[mode].wlr}`),
        wns: mcColor(`${threatColor}${ratio(player.stats.bedwars[mode].wins, Math.floor(player.stats.bedwars.level))}`),
        f: mcColor(`${threatColor}${player.stats.bedwars[mode].finalKills.toLocaleString()}`),
        fkdr: mcColor(`${threatColor}${player.stats.bedwars[mode].fkdr}`),
        fg: mcColor(`${threatColor}${ratio(player.stats.bedwars[mode].finalKills, player.stats.bedwars[mode].games)}`),
        fs: mcColor(`${threatColor}${ratio(player.stats.bedwars[mode].finalKills, Math.floor(player.stats.bedwars.level))}`),
        bb: mcColor(`${threatColor}${player.stats.bedwars[mode].bedsBroken.toLocaleString()}`),
        bblr: mcColor(`${threatColor}${player.stats.bedwars[mode].bblr}`),
        bg: mcColor(`${threatColor}${ratio(player.stats.bedwars[mode].bedsBroken, player.stats.bedwars[mode].games)}`),
        bs: mcColor(`${threatColor}${ratio(player.stats.bedwars[mode].bedsBroken, Math.floor(player.stats.bedwars.level))}`),
        level: mcColor(`${threatColor}${player.level.toFixed(0)}`),
      };

      if (devs.includes(player.uuid.replace(/-/g, ''))) formattedPlayer.tag = mcColor(`§s${read('appearance_tag') ? "D" : "DEV"}`);
      else if (objectValues.length <= 60) {
        if (player.chat == "PARTY") formattedPlayer.tag = mcColor(`§9${read('appearance_tag') ? "P" : "PARTY"}`);

        const filteredPlayers = objectValues.filter(p => p.username != player.username)
        filteredPlayers.forEach(p => {
          if (player.guild && p.guild && player.guild._id && p.guild._id && player.guild._id == p.guild._id) { formattedPlayer.tag = mcColor(`§9${read('appearance_tag') ? "P" : "PARTY"}`); partyMembers[p.uuid] = (p.username) }
          else if (player.stats && p.stats && player.stats.bedwars && p.stats.bedwars) {
            if (player.stats.bedwars.overall.winstreak == p.stats.bedwars.overall.winstreak && player.stats.bedwars.overall.winstreak > 3 && p.stats.bedwars.overall.winstreak > 3) { formattedPlayer.tag = mcColor(`§9${read('appearance_tag') ? "P" : "PARTY"}`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars.doubles.winstreak == p.stats.bedwars.doubles.winstreak && player.stats.bedwars.doubles.winstreak > 3 && p.stats.bedwars.doubles.winstreak > 3) { formattedPlayer.tag = mcColor(`§9${read('appearance_tag') ? "P" : "PARTY"}`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars.threes.winstreak == p.stats.bedwars.threes.winstreak && player.stats.bedwars.threes.winstreak > 3 && p.stats.bedwars.threes.winstreak > 3) { formattedPlayer.tag = mcColor(`§9${read('appearance_tag') ? "P" : "PARTY"}`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars.fours.winstreak == p.stats.bedwars.fours.winstreak && player.stats.bedwars.fours.winstreak > 3 && p.stats.bedwars.fours.winstreak > 3) { formattedPlayer.tag = mcColor(`§9${read('appearance_tag') ? "P" : "PARTY"}`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars["4v4"].winstreak == p.stats.bedwars["4v4"].winstreak && player.stats.bedwars["4v4"].winstreak > 3 && p.stats.bedwars["4v4"].winstreak > 3) { formattedPlayer.tag = mcColor(`§9${read('appearance_tag') ? "P" : "PARTY"}`); partyMembers[p.uuid] = (p.username) }
          }
        })

      }

      if (player.sniper.sniper && !devs.includes(player.uuid.replace(/-/g, ''))) formattedPlayer.tag = mcColor(`§c${read('appearance_tag') ? "S" : "SNIPER"}`);

      if (devs.includes(player.uuid.replace(/-/g, ''))) icon.innerHTML = `<img class="playerBadge" src="img/icons/dev.svg">`
      else if ((verified || []).includes(player.uuid)) icon.innerHTML = `<img class="playerBadge" src="img/icons/verified.png">`

      if (player.exists != false) head.innerHTML = `<img style="left: 4px;" src="https://crafatar.com/avatars/${player.uuid}?size=16&overlay=true" class="skull";></img>`;

      name.innerHTML = `${makeTooltip(index + 1, mcColor(`${getBwFormattedLevel(Math.floor(player.stats.bedwars.level))} ${player.displayName}${player.guild && read("guildEnabled_tag") ? player.guild.tag ? ` ${player.guild.mcColor.mc}[${player.guild.tag}]` : "" : ""}`), mcColor(`
      ${player.displayName} ${player.guild ? player.guild.tag ? `${player.guild.mcColor.mc}[${player.guild.tag}]` : "" : ""}
      <br>
      ${player.guild ? player.guild.name ? `§7Guild: ${player.guild.mcColor.mc}${player.guild.name}<br>` : "" : ""}<br>
      ${Object.values(partyMembers).length ? ("§7Party Members:<br>§9" + Object.values(partyMembers).join("<br>") + "<br><br>") : player.chat == "PARTY" ? "§7Party: §9Chat <br><br>" : ""}
      §7Level: ${getBwFormattedLevel(Math.floor(player.stats.bedwars.level)).replace(/[\[\]]/g, "")}<br>
      §7Winstreak: ${threatColor}${player.stats.bedwars[mode].winstreak.toLocaleString()}<br>
      §7Games Played: ${threatColor}${player.stats.bedwars[mode].games.toLocaleString()}<br>
      <br>
      §7Wins: ${threatColor}${player.stats.bedwars[mode].wins.toLocaleString()}<br>
      §7Losses: ${threatColor}${player.stats.bedwars[mode].losses.toLocaleString()}<br>
      §7WLR: ${threatColor}${player.stats.bedwars[mode].wlr}<br>
      <br>
      §7Final Kills: ${threatColor}${player.stats.bedwars[mode].finalKills.toLocaleString()}<br>
      §7Final Deaths: ${threatColor}${player.stats.bedwars[mode].finalDeaths.toLocaleString()}<br>
      §7FKDR: ${threatColor}${player.stats.bedwars[mode].fkdr}<br />
      <br>
      §7Beds Broken: ${threatColor}${player.stats.bedwars[mode].bedsBroken.toLocaleString()}<br>
      §7Beds Lost: ${threatColor}${player.stats.bedwars[mode].bedsLost.toLocaleString()}<br>
      §7BBLR: ${threatColor}${player.stats.bedwars[mode].bblr}<br>
      `))}</div>`

      var count = 0;
      read('table_customTable').forEach((item, index) => {
        if (item.value == 'none') return;
        rows[count].innerHTML = formattedPlayer[item.value]
        count++
      })

      name.onmouseover = () => {
        if (read("resizeEnabled")) {
          var window = remote.getCurrentWindow()
          var size = { x: window.getSize()[0], y: 460 }
          if (objectValues.length >= 16) size = { x: window.getSize()[0], y: 460 }
          else size = { x: window.getSize()[0], y: (450 <= Math.round(objectValues.length * 26) + 5 ? Math.round(objectValues.length * 26) + 5 : 450) }

          window.setSize(size.x, size.y)
        }
      }
    }
  });

  if (read("resizeEnabled")) {
    if ((document.getElementById("menu").classList.item(1) || "None") != "None") {
      var window = remote.getCurrentWindow()
      var size = { x: window.getSize()[0], y: 460 }
      if (objectValues.length >= 16) size = { x: window.getSize()[0], y: 460 }
      else size = { x: window.getSize()[0], y: 60 + Math.round(objectValues.length * 26) + 5 }

      window.setSize(size.x, size.y)
    }
  }
}

module.exports = tableUpdater