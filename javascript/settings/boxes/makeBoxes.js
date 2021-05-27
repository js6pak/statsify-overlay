const settings = document.getElementById("settingsItems");
var settingsList = [
    {
        title: 'Auto Who',
        defaultValue: true,
        platforms: ["win32", "darwin"],
        image: 'keyboard.png',
        value: 'autoWho',
        description: `Automatically types '/who' when you enter a game. This means that the users that joined before you are included in the overlay. Use at your own risk!`
    },
    {
        title: 'Auto Hide',
        defaultValue: false,
        image: 'hide.png',
        value: 'autoHide',
        html: `<p>Time taken to hide:</p><input type="text">`,
        description: `Automatically hides the overlay after a set amount of inactivity time has occured.`,
        extraOptions: [
            {
                "title": "Hide After (ms)",
                "type": {
                    "input": "slider",
                    "default": "20000",
                    "range": [5000, 35000],
                    "unit": "ms",
                    "value": "hideAfter",
                    "section": "autoHide",
                    "hover": "Control the amount of inactivity time that the overlay will hide after.",
                }
            }
        ]
    },
    {
        title: 'Guild Data',
        defaultValue: false,
        value: 'guildEnabled',
        image: 'guild.png',
        description: `Adds guild information to players, which makes it easier for our algorithm to detect partys. However uses 2x the API Requests!`,
        extraOptions: [
            {
                "title": "Guild Tags",
                "type": {
                    "input": "toggle",
                    "default": true,
                    "value": "tag",
                    "hover": "Control whether or not guild tags will show, guild data will still be kept for parties with this toggled off. This helps with keeping the size (width) of the overlay down.",
                    "section": "guildEnabled"
                },
            },
        ]
    },
    {
        title: 'Lobby Chat',
        defaultValue: false,
        value: 'lobbyEnabled',
        image: 'chat.png',
        description: `Adds players who talk in lobby chat to your overlay. This is very useful for finding lobby parties.`
    },
    {
        title: 'Party Info',
        defaultValue: false,
        value: 'partyEnabled',
        image: 'party.png',
        description: `Adds people who: invite you; are in your party; you invite; and so on, to the overlay. This is also very useful for finding lobby parties.`
    },
    {
        title: 'Auto Scale',
        defaultValue: false,
        value: 'resizeEnabled',
        image: 'autoScale.png',
        description: `Automatically adjusts the height of the overlay depending on the amount of players shown. This helps with compacting the overlay.`
    },
    {
        title: 'Notifications',
        defaultValue: true,
        value: 'notifications',
        image: 'notif.png',
        description: `Alerts you with a notification when the overlay has hidden itself.`
    },
    {
        title: 'Tab To Show',
        defaultValue: false,
        platforms: ["win32"],
        value: 'tabToShow',
        image: 'tabToShow.png',
        description: `Press tab to either toggle or temporarily show the overlay. This helps easily opening the overlay again.`
    },
    {
        title: 'Index Colors',
        defaultValue: true,
        value: 'indexColors',
        image: 'colors.png',
        resetOptions: {
            redraw: true
        },
        extraOptions: [
            {
                "type": {
                    "input": "color",
                    "default": [
                        { rating: 0, color: "#AAAAAA" },
                        { rating: 45, color: "#55FF55" },
                        { rating: 80, color: "#00AA00" },
                        { rating: 120, color: "#FFFF55" },
                        { rating: 225, color: "#FFAA00" },
                        { rating: 325, color: "#FF5555" },
                        { rating: 650, color: "#AA0000" },
                    ],
                    "value": "color",
                    "section": "index"
                }
            },
        ],
        description: `Choose which colors represent which index ranges on the overlay. This helps to easily identify good players from the bad ones.`,
        alwaysEnabled: true,
    },
    {
        title: 'Appearance',
        defaultValue: true,
        value: 'appearance',
        image: 'appearance.png',
        extraOptions: [
            {
                "title": "Round Corners",
                "type": {
                    "input": "slider",
                    "default": 0,
                    "range": [0, 25],
                    "unit": "px",
                    "value": "round",
                    "section": "appearance",
                    "hover": "Control how many pixels to round the overlay corners by.",
                },
                "callback": () => {
                    const roundAmount = read(`appearance_round`);
                    document.documentElement.style.setProperty('--corner-round', `${roundAmount}px`);
                },
            },
            {
                "title": "Limit Players Shown",
                "type": {
                    "input": "slider",
                    "default": "100",
                    "range": [20, 150],
                    "unit": " players",
                    "value": "playerLimit",
                    "section": "appearance",
                    "hover": "Control the amount of players that the overlay will show. Will bug out sometimes if 'reverse sort' is enabled so beware.",
                }
            },
            {
                "title": "HD Font",
                "type": {
                    "input": "toggle",
                    "default": false,
                    "value": "hd",
                    "hover": "Chooses whether you want the default or high definition font for Minecraft.",
                    "section": "appearance"
                },
                "callback": () => {
                    const hd = read(`appearance_hd`);

                    document.documentElement.style.setProperty('--mc-font-family', `${hd ? "MinecraftHD" : "Minecraft"}`);
                    document.documentElement.style.setProperty('--mc-font-size', `${hd ? 12 : 16}px`);
                },
            },
            {
                "title": "Shorten Tags",
                "type": {
                    "input": "toggle",
                    "default": false,
                    "value": "tag",
                    "hover": "Shorten player tags from full to single letter (for example 'Party' will turn into 'P'). This can help with keeping the size (width) of the overlay down.",
                    "section": "appearance"
                }
            },
            {
                "title": "Shorten Ranks",
                "type": {
                    "input": "toggle",
                    "default": false,
                    "value": "rank",
                    "hover": "Shorten player ranks from full to single letter (for example 'MVP+' will turn into 'M+'). This helps with keeping the size (width) of the overlay down.",
                    "section": "appearance"
                }
            },
            {
                "title": "Remove Icons",
                "type": {
                    "input": "toggle",
                    "default": false,
                    "value": "icon",
                    "hover": "Removes the icon prefix from the overlay (for example the verified and developer badges). This helps with keeping the size (width) of the overlay down.",
                    "section": "appearance"
                }
            },
            {
                "title": "Reverse Sort",
                "type": {
                    "input": "toggle",
                    "default": false,
                    "value": "sort",
                    "hover": "Reverses the sorting of the overlay to be lowest to highest sorting values rather than highest to lowest.",
                    "section": "appearance"
                }
            },
            {
                "title": "Snipers on Top",
                "type": {
                    "input": "toggle",
                    "default": false,
                    "value": "sniper",
                    "hover": "Gives players with a sniper tag an infinite index score making them appear at the top just like nicked players do.",
                    "section": "appearance"
                }
            },
            {
                "title": "Table Row Number",
                "type": {
                    "input": "toggle",
                    "default": false,
                    "value": "row",
                    "hover": "Puts a number next to the user depending on there row in the overlay, userful for finding out how many users are currently shown on the overlay.",
                    "section": "appearance"
                }
            },
        ],
        description: `Customize the looks of the overlay to your preference!`,
        alwaysEnabled: true,
    },
    {
        title: 'Table Editor',
        defaultValue: true,
        value: 'table',
        image: 'table.png',
        description: `Allows you to choose the order the stats of players in the table show. This helps with ensuring you see the stats you want to see first.`,
        resetOptions: {
            redraw: true
        },
        extraOptions: [
            {
                "type": {
                    "input": "table",
                    "default": [
                        { title: "Tag", value: "tag", id: "tagOption", displayValue: "TAG" },
                        { title: "Winstreak", value: "ws", id: "wsOption", displayValue: "WS" },
                        { title: "Wins", value: "w", id: "wOption", displayValue: "Wins" },
                        { title: "Finals", value: "f", id: "fOption", displayValue: "Finals" },
                        { title: "FKDR", value: "fkdr", id: "fkdrOption", displayValue: "FKDR" },
                        { title: "WLR", value: "wlr", id: "wlrOption", displayValue: "WLR" },
                        { title: "BBLR", value: "bblr", id: "bblrOption", displayValue: "BBLR" },
                        { title: "None", value: "none", id: "noneOption", displayValue: "" },
                    ],
                    "value": "customTable",
                    "section": "table"
                }
            },
        ],
        alwaysEnabled: true,
    }
]

const parseType = data => {
    if (data.type.input == "slider") return slider(data)
    else if (data.type.input == "toggle") return toggle(data)
    else if (data.type.input == "color") return create(data)
    else if (data.type.input == "dropdown") return dropdown(data)
    else if (data.type.input == "table") return table(data)
    else return false;
}

const parseTypeJS = data => {
    if (data.type.input == "slider") return sliderJS(data)
    else if (data.type.input == "toggle") return toggleJS(data)
    else if (data.type.input == "color") return colorPickerJS(data)
    else if (data.type.input == "dropdown") return dropdownJS(data)
    else if (data.type.input == "table") return tableJS(data)
    else return false;
}

const groupedSettings = []

settingsList = settingsList.filter((item) => {
    return item.platforms?.includes(process.platform) ?? true;
})

while (settingsList.length > 0) {
    const chunk = settingsList.splice(0, 3)
    groupedSettings.push(chunk)
}

groupedSettings.forEach((item, index) => {
    item.forEach((value, index) => {
        if (read(value.value) == undefined) write(value.value, value.defaultValue);

        if (value.extraOptions) {
            value.extraOptions.forEach((item, index) => {
                if (!item.type) return;
                if (item.callback) item.callback();
                if (read(`${item.type.section}_${item.type.value}`) == undefined) write(`${item.type.section}_${item.type.value}`, item.type.default);
            })
        }
    })
});

groupedSettings.forEach((item, index) => {
    const row = settings.insertRow(index + 1)
    item.forEach((value, index) => {
        const cell = row.insertCell(index)
        cell.style.width = '33%'
        cell.innerHTML = `
        <div class="settingPanel">
            <img class="panelIMG" src="img/icons/settings/${value.image}"></img><br>
            <h4 class="panelTitle">${value.title}</h4><br> 
            <div class="settingOptions" id="${value.value}settingOptions">
                <p class="optionsBox">${value.extraOptions ? "<span class='optionsTexts'>Options</span><img class='optionsImage' src='img/icons/settings.png'></img><br>" : "<span class='optionsTexts'>Description</span><img class='optionsImage' src='img/icons/description.png'></img><br>"}</p>
            </div>
            <button id="${value.value}"><p>TOGGLE</p></button>
        </div><br>`

        const htmlItem = document.getElementById(value.value)
        const options = document.getElementById(`${value.value}settingOptions`)

        const setButtonColor = () => {
            if (read(value.value) == undefined) {
                write(value.value, value.default);
                setButtonColor()
            } else if (read(value.value) == true || value.alwaysEnabled) {
                htmlItem.style['background-color'] = "#30a465"
                htmlItem.style['border-color'] = "#FFF"
                htmlItem.innerHTML = "ENABLED"
            } else if (read(value.value) == false && !value.alwaysEnabled) {
                const htmlItem = document.getElementById(value.value)
                htmlItem.style['background-color'] = "#ac2748"
                htmlItem.style['border-color'] = "#FFF"
                htmlItem.innerHTML = "DISABLED"
            }
        }

        setButtonColor()

        htmlItem.addEventListener('click', () => {
            write(value.value, read(value.value) ? false : true)
            setButtonColor()
        })

        options.addEventListener('click', () => {
            const menu = document.getElementById("indepth-options");
            menu.classList.remove('hidden')
            const settings = document.getElementById('settings')
            settings.classList.add('hidden')

            const infoArea = document.getElementById('options-info')
            var html = `<h1 class="optionTitle">${value.title}</h1>
            <p class="optionDesc">${value.description || "No Description Set"}</p><br>`

            var optionsHTML = [];
            if (value.extraOptions) {
                value.extraOptions.forEach((item, index) => {
                    if (!item.type) return;
                    if (read(`${item.type.section}_${item.type.value}`) == undefined) write(`${item.type.section}_${item.type.value}`, item.type.default);

                    let response = parseType(item);
                    if (response != false) optionsHTML.push(response);
                })
            }

            infoArea.innerHTML = `${html}<div id="options-area">${optionsHTML.join("<br>")}</div>`;
            optionsHTML.forEach((item, index) => parseTypeJS(value.extraOptions[index]))

            const resetButton = document.getElementById("resetButton");
            resetButton.addEventListener('click', () => {
                reset(value);
                var newHtml = [];
                var reDraw = false;
                if (value.resetOptions) {
                    optionsHTML.forEach((item, index) => {
                        if (value.resetOptions.redraw) {
                            reDraw = true;
                            newHtml.push(parseType(value.extraOptions[index]))
                        }

                        if (reDraw) infoArea.innerHTML = `${html}<div id="options-area">${newHtml.join("<br>")}</div>`;
                    })
                }

                optionsHTML.forEach((item, index) => parseTypeJS(value.extraOptions[index]))
            })
        })
    })
})