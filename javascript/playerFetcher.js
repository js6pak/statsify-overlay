const fetch = require('node-fetch')
const schedule = require('node-schedule');

var keyCount;
var keyMax;

const addRequest = () => {
    if (keyCount != undefined && keyMax != undefined) {
        keyCount++
        document.getElementById("creditFooter").innerHTML = `v${vers || "0.0.0"} | Requests: ${keyCount}/${keyMax}<br>${credits}`
    }
}

const getKey = async (key) => {
    return new Promise(async resolve => {
        const data = await fetch(`https://api.hypixel.net/key?key=${key}`)
        try { var body = await data.json() } catch { resolve({ valid: false }) }
        if (body.success) resolve({ valid: true, max: body.record.limit })
        else resolve({ valid: false })
    })
}

const timeout = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
const rNum = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) };

const getPlayer = async (user, backup) => {
    const player = new Promise(async resolve => {
        if (keyCount >= keyMax + 15) return resolve({ error: true, throttle: true, username: user })
        addRequest();

        const requestTime = Date.now();

        const data = await fetch(`https://api.hypixel.net/player?key=${read("api")}${user.length > 16 ? `&uuid=` : `&name=`}${user}`)

        try { var body = await data.json() } catch { resolve({ error: true, outage: true, username: backup || user }) }
  
        if (body.throttle) resolve({ error: true, throttle: true, username: backup || user })
        else if (body.cause == "Invalid API key") resolve({ error: true, invalid: true, username: backup || user })
        else if (body.cause == "You have already looked up this name recently") resolve({ error: true, repeat: true, username: backup || user, response: body })
        else if (body.success == false || body.player == null || !body.player.displayname) resolve({ error: true, exists: false, username: backup || user })
        else {
            var player = body.player
            var bedwars = player.stats ? player.stats.Bedwars || {} : {}
            var rank = getRank(player)
            var plusColor = getPlusColor(rank, player.rankPlusColor)
            var formattedRank = getFormattedRank(rank, plusColor.mc)
            var origUsername = user

            resolve({
                uuid: player.uuid,
                username: player.displayname,
                inputtedUsername: origUsername,
                displayName: `${formattedRank}${player.displayname}`,
                chat: player.channel,
                level: nwLevel(player.networkExp || 0),

                rank: rank,
                plus: plusColor,
                stats: {
                    bedwars: {
                        level: getBwLevel(bedwars.Experience),
                        xp: bedwars.Experience || 0,
                        coins: bedwars.coins || 0,
                        overall: {
                            games: bedwars.games_played_bedwars || 0,
                            winstreak: bedwars.winstreak || 0,
                            wins: bedwars.wins_bedwars || 0,
                            losses: bedwars.losses_bedwars || 0,
                            wlr: ratio(bedwars.wins_bedwars, bedwars.losses_bedwars),
                            finalKills: bedwars.final_kills_bedwars || 0,
                            finalDeaths: bedwars.final_deaths_bedwars || 0,
                            fkdr: ratio(bedwars.final_kills_bedwars, bedwars.final_deaths_bedwars),
                            kills: bedwars.kills_bedwars || 0,
                            deaths: bedwars.deaths_bedwars || 0,
                            kdr: ratio(bedwars.kills_bedwars, bedwars.deaths_bedwars),
                            bedsBroken: bedwars.beds_broken_bedwars || 0,
                            bedsLost: bedwars.beds_lost_bedwars || 0,
                            bblr: ratio(bedwars.beds_broken_bedwars, bedwars.beds_lost_bedwars),
                            itemsCollected: {
                                iron: bedwars.iron_resources_collected_bedwars || 0,
                                gold: bedwars.gold_resources_collected_bedwars || 0,
                                diamond: bedwars.diamond_resources_collected_bedwars || 0,
                                emerald: bedwars.emerald_resources_collected_bedwars || 0
                            }
                        },
                        solo: {
                            games: bedwars.eight_one_games_played_bedwars || 0,
                            winstreak: bedwars.eight_one_winstreak || 0,
                            wins: bedwars.eight_one_wins_bedwars || 0,
                            losses: bedwars.eight_one_losses_bedwars || 0,
                            wlr: ratio(bedwars.eight_one_wins_bedwars, bedwars.eight_one_losses_bedwars),
                            finalKills: bedwars.eight_one_final_kills_bedwars || 0,
                            finalDeaths: bedwars.eight_one_final_deaths_bedwars || 0,
                            fkdr: ratio(bedwars.eight_one_final_kills_bedwars, bedwars.eight_one_final_deaths_bedwars),
                            kills: bedwars.eight_one_kills_bedwars || 0,
                            deaths: bedwars.eight_one_deaths_bedwars || 0,
                            kdr: ratio(bedwars.eight_one_kills_bedwars, bedwars.eight_one_deaths_bedwars),
                            bedsBroken: bedwars.eight_one_beds_broken_bedwars || 0,
                            bedsLost: bedwars.eight_one_beds_lost_bedwars || 0,
                            bblr: ratio(bedwars.eight_one_beds_broken_bedwars, bedwars.eight_one_beds_lost_bedwars),
                            itemsCollected: {
                                iron: bedwars.eight_one_iron_resources_collected_bedwars || 0,
                                gold: bedwars.eight_one_gold_resources_collected_bedwars || 0,
                                diamond: bedwars.eight_one_diamond_resources_collected_bedwars || 0,
                                emerald: bedwars.eight_one_emerald_resources_collected_bedwars || 0
                            }
                        },
                        doubles: {
                            games: bedwars.eight_two_games_played_bedwars || 0,
                            winstreak: bedwars.eight_two_winstreak || 0,
                            wins: bedwars.eight_two_wins_bedwars || 0,
                            losses: bedwars.eight_two_losses_bedwars || 0,
                            wlr: ratio(bedwars.eight_two_wins_bedwars, bedwars.eight_two_losses_bedwars),
                            finalKills: bedwars.eight_two_final_kills_bedwars || 0,
                            finalDeaths: bedwars.eight_two_final_deaths_bedwars || 0,
                            fkdr: ratio(bedwars.eight_two_final_kills_bedwars, bedwars.eight_two_final_deaths_bedwars),
                            kills: bedwars.eight_two_kills_bedwars || 0,
                            deaths: bedwars.eight_two_deaths_bedwars || 0,
                            kdr: ratio(bedwars.eight_two_kills_bedwars, bedwars.eight_two_deaths_bedwars),
                            bedsBroken: bedwars.eight_two_beds_broken_bedwars || 0,
                            bedsLost: bedwars.eight_two_beds_lost_bedwars || 0,
                            bblr: ratio(bedwars.eight_two_beds_broken_bedwars, bedwars.eight_two_beds_lost_bedwars),
                            itemsCollected: {
                                iron: bedwars.eight_two_iron_resources_collected_bedwars || 0,
                                gold: bedwars.eight_two_gold_resources_collected_bedwars || 0,
                                diamond: bedwars.eight_two_diamond_resources_collected_bedwars || 0,
                                emerald: bedwars.eight_two_emerald_resources_collected_bedwars || 0
                            }
                        },
                        threes: {
                            games: bedwars.four_three_games_played_bedwars || 0,
                            winstreak: bedwars.four_three_winstreak || 0,
                            wins: bedwars.four_three_wins_bedwars || 0,
                            losses: bedwars.four_three_losses_bedwars || 0,
                            wlr: ratio(bedwars.four_three_wins_bedwars, bedwars.four_three_losses_bedwars),
                            finalKills: bedwars.four_three_final_kills_bedwars || 0,
                            finalDeaths: bedwars.four_three_final_deaths_bedwars || 0,
                            fkdr: ratio(bedwars.four_three_final_kills_bedwars, bedwars.four_three_final_deaths_bedwars),
                            kills: bedwars.four_three_kills_bedwars || 0,
                            deaths: bedwars.four_three_deaths_bedwars || 0,
                            kdr: ratio(bedwars.four_three_kills_bedwars, bedwars.four_three_deaths_bedwars),
                            bedsBroken: bedwars.four_three_beds_broken_bedwars || 0,
                            bedsLost: bedwars.four_three_beds_lost_bedwars || 0,
                            bblr: ratio(bedwars.four_three_beds_broken_bedwars, bedwars.four_three_beds_lost_bedwars),
                            itemsCollected: {
                                iron: bedwars.four_three_iron_resources_collected_bedwars || 0,
                                gold: bedwars.four_three_gold_resources_collected_bedwars || 0,
                                diamond: bedwars.four_three_diamond_resources_collected_bedwars || 0,
                                emerald: bedwars.four_three_emerald_resources_collected_bedwars || 0
                            }
                        },
                        fours: {
                            games: bedwars.four_four_games_played_bedwars || 0,
                            winstreak: bedwars.four_four_winstreak || 0,
                            wins: bedwars.four_four_wins_bedwars || 0,
                            losses: bedwars.four_four_losses_bedwars || 0,
                            wlr: ratio(bedwars.four_four_wins_bedwars, bedwars.four_four_losses_bedwars),
                            finalKills: bedwars.four_four_final_kills_bedwars || 0,
                            finalDeaths: bedwars.four_four_final_deaths_bedwars || 0,
                            fkdr: ratio(bedwars.four_four_final_kills_bedwars, bedwars.four_four_final_deaths_bedwars),
                            kills: bedwars.four_four_kills_bedwars || 0,
                            deaths: bedwars.four_four_deaths_bedwars || 0,
                            kdr: ratio(bedwars.four_four_kills_bedwars, bedwars.four_four_deaths_bedwars),
                            bedsBroken: bedwars.four_four_beds_broken_bedwars || 0,
                            bedsLost: bedwars.four_four_beds_lost_bedwars || 0,
                            bblr: ratio(bedwars.four_four_beds_broken_bedwars, bedwars.four_four_beds_lost_bedwars),
                            itemsCollected: {
                                iron: bedwars.four_four_iron_resources_collected_bedwars || 0,
                                gold: bedwars.four_four_gold_resources_collected_bedwars || 0,
                                diamond: bedwars.four_four_diamond_resources_collected_bedwars || 0,
                                emerald: bedwars.four_four_emerald_resources_collected_bedwars || 0
                            }
                        },
                        "4v4": {
                            games: bedwars.two_four_games_played_bedwars || 0,
                            winstreak: bedwars.two_four_winstreak || 0,
                            wins: bedwars.two_four_wins_bedwars || 0,
                            losses: bedwars.two_four_losses_bedwars || 0,
                            wlr: ratio(bedwars.two_four_wins_bedwars, bedwars.two_four_losses_bedwars),
                            finalKills: bedwars.two_four_final_kills_bedwars || 0,
                            finalDeaths: bedwars.two_four_final_deaths_bedwars || 0,
                            fkdr: ratio(bedwars.two_four_final_kills_bedwars, bedwars.two_four_final_deaths_bedwars),
                            kills: bedwars.two_four_kills_bedwars || 0,
                            deaths: bedwars.two_four_deaths_bedwars || 0,
                            kdr: ratio(bedwars.two_four_kills_bedwars, bedwars.two_four_deaths_bedwars),
                            bedsBroken: bedwars.two_four_beds_broken_bedwars || 0,
                            bedsLost: bedwars.two_four_beds_lost_bedwars || 0,
                            bblr: ratio(bedwars.two_four_beds_broken_bedwars, bedwars.two_four_beds_lost_bedwars),
                            itemsCollected: {
                                iron: bedwars.two_four_iron_resources_collected_bedwars || 0,
                                gold: bedwars.two_four_gold_resources_collected_bedwars || 0,
                                diamond: bedwars.two_four_diamond_resources_collected_bedwars || 0,
                                emerald: bedwars.two_four_emerald_resources_collected_bedwars || 0
                            }
                        }
                    }
                },
                requestedAt: requestTime
            })
        }
    });

    const sniper = new Promise(async resolve => {
        setTimeout(() => {
            resolve({ error: true, sniper: false, outage: true })
        }, 600);

        const data = await fetch(`https://statsify.net/api/overlay/sniper?player=${user}`)

        try { var body = await data.json() } catch { resolve({ error: true, sniper: false, outage: true }) };

        resolve(body);
    });

    const [playerData, sniperData] = await Promise.all([player, sniper]);
    playerData.sniper = sniperData;

    return playerData;
}

const getGuild = async (uuid) => {
    addRequest()
    if (keyCount >= keyMax + 15) return { throttle: true }
    return new Promise(async resolve => {
        const data = await fetch(`https://api.hypixel.net/guild?key=${read("api")}&player=${uuid}`)
        try { var body = await data.json() } catch { resolve({ outage: true }) }
        if (body.throttle) resolve({ throttle: true })
        if (body.cause == "Invalid API key") resolve({ invalid: true })
        if (body.success == false || body.guild == null || !body.guild.name) resolve({ exists: false })
        else {
            const getGuildTagColor = color => ({ "DARK_AQUA": { hex: "#00AAAA", mc: "§3" }, "DARK_GREEN": { hex: "#00AA00", mc: "§2" }, "YELLOW": { hex: "#FFFF55", mc: "§e" }, "GOLD": { hex: "#FFAA00", mc: "§6" } }[color] || { hex: "#AAAAAA", mc: "§7" })

            body.guild.mcColor = getGuildTagColor(body.guild.tagColor);

            if (body.guild.members) body.guild.members.forEach(member => cachedGuilds.set(member.uuid, body.guild));
            resolve(body.guild)
        }
    })
}

const getUUID = async (user) => {
    const playerdb = new Promise(async resolve => {
        const data = await fetch(`https://playerdb.co/api/player/minecraft/${user}`)

        try { var body = await data.json() } catch { resolve(user) };
        //console.log({ uuid: (body && body.data && body.data.player && body.data.player.raw_id) || user, username: (body && body.data && body.data.player.username) || user });
        resolve({ uuid: (body && body.data && body.data.player && body.data.player.raw_id) || user, username: (body && body.data && body.data.player.username) || user });
    });

    const ashcon = new Promise(async resolve => {
        const data = await fetch(`https://api.ashcon.app/mojang/v2/user/${user}`)

        try { var body = await data.json() } catch { resolve(user) };
        //console.log({ uuid: (body && body.uuid && body.uuid.replace(/-/g, '')) || user, username: (body && body.username) || user });
        resolve({ uuid: (body && body.uuid && body.uuid.replace(/-/g, '')) || user, username: (body && body.username) || user });
    });

    return await Promise.race([playerdb, ashcon]);
}

const getVerified = async () => {
    const body = await fetch('https://statsify.net/api/verified')
    const data = await body.json()

    if (data.success) write('verified', data.verified);
}

const pingAntisniper = async () => await fetch('https://statsify.net/api/overlay/sniper?player=ping')

getVerified()
pingAntisniper()

setInterval(() => {
    getVerified()
    pingAntisniper()
}, 600000);

/* Randomly assign which order the credits are in on run */
var authors = ["imconnorngl", "videogameking", "ugcodrr"]
authors = authors.sort(() => .5 - Math.random());
var credits = `Made by ${authors[0]}, ${authors[1]} & ${authors[2]} © Statsify Inc.`

/* API Counter */
var api = read("api")
var vers = read("version")

if (api) {
    const form = document.getElementById("apiKeyField");

    document.getElementById("apiKeyField").value = api

    getKey(api).then(keyStatus => {
        if (keyStatus.valid == true) {
            keyCount = 0
            keyMax = keyStatus.max || 120

            schedule.scheduleJob('1 * * * * *', () => {
                keyCount = 0

                document.getElementById("creditFooter").innerHTML = `v${vers || "0.0.0"} | Requests: ${keyCount}/${keyMax}<br>${credits}`
            });

            document.getElementById("creditFooter").innerHTML = `v${vers || "0.0.0"} | Requests: ${keyCount}/${keyMax}<br>${credits}`
        }
    })
} else {
    const form = document.getElementById("apiKeyField");
    document.getElementById("creditFooter").innerHTML = `v${vers || "0.0.0"} | ${credits}`
}