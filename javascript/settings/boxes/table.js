const options = [
    {
        title: 'None',
        value: "none",
        id: "noneOption",
        displayValue: "",
    },
    {
        title: 'Tag',
        value: "tag",
        id: "tagOption",
        displayValue: "TAG",
    },
    {
        title: 'Index Score',
        value: "i",
        id: "iOption",
        displayValue: "INDEX",
    },
    {
        title: 'Winstreak',
        value: "ws",
        id: "wsOption",
        displayValue: "WS",
    },
    {
        title: 'Wins',
        value: "w",
        id: "wOption",
        displayValue: "Wins",
    },
    {
        title: 'Losses',
        value: "l",
        id: "lOption",
        displayValue: "Losses",
    },
    {
        title: 'WLR',
        value: "wlr",
        id: "wlrOption",
        displayValue: "WLR",
    },
    {
        title: 'Wins/Star',
        value: "wns",
        id: "wnsOption",
        displayValue: "W/@",
    },
    {
        title: 'Finals',
        value: "f",
        id: "fOption",
        displayValue: "Finals",
    },
    {
        title: 'FKDR',
        value: "fkdr",
        id: "fkdrOption",
        displayValue: "FKDR",
    },
    {
        title: 'Finals/Game',
        value: "fg",
        id: "fgOption",
        displayValue: "F/G",
    },
    {
        title: 'Finals/Star',
        value: "fs",
        id: "fsOption",
        displayValue: "F/@",
    },
    {
        title: 'Beds Broken',
        value: "bb",
        id: "bbOption",
        displayValue: "BB",
    },
    {
        title: 'BBLR',
        value: "bblr",
        id: "bblrOption",
        displayValue: "BBLR",
    },
    {
        title: 'Beds/Game',
        value: "bg",
        id: "bgOption",
        displayValue: "B/G"
    },
    {
        title: 'Beds/Star',
        value: "bs",
        id: "bsOption",
        displayValue: "B/@",
    },
    {
        title: 'Hypixel Level',
        value: "level",
        id: "levelOption",
        displayValue: "LEVEL",
    },
]

var savedOptions = read('table_customTable')

const optionHTML = () => {
    savedOptions = read('table_customTable')
    var totalHTML = [];

    for (var i = 0; i < 8; i++) {
        var html = []
        html.push(`<select onchange="tableJS()" name="tableEditor" id="table${i}Drop" style="width: 30%; margin: 7.5px 25px 7.5px 25px">`)
        options.forEach((option, index) => {
            html.push(`<option ${option.value == savedOptions[i].value ? selected="selected" : ''} value="${option.value}" >${option.title}</option>`)
        })
        html.push(`</select>${i % 2 ? '<br>': ''}`);
        totalHTML.push(html.join(''));
    }

    return totalHTML.join("");
}

const table = data => {
    var html = `
        <div class="tableDropdown" style="-webkit-app-region: no-drag">
            <table id="dummyTable">
                <tr>
                <th class="iconRow"></th>
                <th></th>
                <th class="tableHeader">PLAYER</th>
                <th class="tableHeader">TAG</th>
                <th class="tableHeader">WS</th>
                <th class="tableHeader">WINS</th>
                <th class="tableHeader">FINALS</th>
                <th class="tableHeader">FKDR</th>
                <th class="tableHeader">WLR</th>
                <th class="tableHeader">BBLR</th>
                </tr>
            </table><br>
            ${optionHTML()}
        </div>
    `
    return html
}

const tableJS = data => {
    const optionsHTML = []
    const optionsObjs = []

    for (var i = 0; i < 8; i++) {
        const dropdown = document.getElementById(`table${i}Drop`);

        const dropdownVal = options.find(o => o.value == dropdown.value)
        optionsObjs.push(dropdownVal)
        optionsHTML.push(`<th class='tableHeader'>${(dropdownVal.displayValue).toUpperCase()}</th>`)

    }

    const fakeTable = document.getElementById('dummyTable');
    const fakeRows = fakeTable.rows;

    fakeRows[0].innerHTML = `
    <th class="iconRow"></th>
    <th></th>
    <th class="tableHeader">PLAYER</th>
    ${optionsHTML.join('')}`

    write(`table_customTable`, optionsObjs);
    tableUpdater()
}
