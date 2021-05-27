const faqTooltip = document.getElementById("faq-tooltip")
var page = 0
var indexes = read('index_color');

var i = 0;

const makePages = () => {
    indexes = read('index_color');
    i = 0;
    return [
`<p>${mcColor(`
§9Overlay In-game Commands §8»<br>
§f/t .[user] | §7Forceful add a user<br>
§f/t .h | §7Forcefully Hide Overlay<br>
§f/t .s | §7Forcefully Show Overlay<br>
§f/t .c | §7Forcefully Clear the Player List<br>
<br>
§cExamples§f§8 »<br>
§f/t .gamerboy80 | §7Forcefully adds \'§fgamerboy80§7\' to the overlay<br><br>`)}
<br>
<br>
</p>`,

`
<p>${mcColor(`
§9Threat Formula §8» (§fStar§7*§eFKDR§7^§62§8)§7/§f10<br>
`)}</p>
<table>
    <tr>
        <th class="faqTableHeader">${mcColor("§9Default Colors")}</th>
        <th class="faqTableHeader">${mcColor("§9Custom Colors")}</th>
    </tr>
    <tr>
        <td>${mcColor(`§7■ = 0 - 44`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
    </tr>
    <tr>
        <td>${mcColor(`§a■ = 45 - 79`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
    </tr>
    <tr>
        <td>${mcColor(`§2■ = 80 - 119`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
    </tr>
    <tr>
        <td>${mcColor(`§e■ = 120 - 224`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
    </tr>
    <tr>
        <td>${mcColor(`§6■ = 225 - 324`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
    </tr>
    <tr>
        <td>${mcColor(`§c■ = 325 - 649`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
    </tr>
    <tr>
        <td>${mcColor(`§4■ = 650 - ∞`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
        <td>${i == indexes.length ? '' : mcColor(`§#${indexes[i].color}■ = ${indexes[i].rating} - ${++i == indexes.length ? "∞" : indexes[i].rating - 1}`)}</td>
    </tr>
</table>
<br>
`,

`<p>${mcColor(`
§9Tag Images §8»<br>
<img class="skull" src="img/icons/dev.svg"></img> §s= Statsify Developer<br>
<img class="skull" <img src="img/icons/check.png"></img> §2= Statsify Verified<br><br>
<img class="skull" <img src="img/icons/right.png"></img> §9= In Party (Hover for Info)<br>
<img class="skull" <img src="img/icons/warn.png"></img> §4= Nicked<br>§c
<br>
<br>
<br>
<br>
<br>
`)}</p>`
]};

var pages = makePages()

const increment = () => {
    if (++page >= pages.length) page = 0
    faqTooltip.innerHTML = `
    ${makePages()[page]}
    <a class="arrow" onclick=decrement()><img src="img/icons/left.png"></img></a>
    <a class="arrow" onclick=increment()><img src="img/icons/right.png"></img></a>
    `
}

const decrement = () => {
    if (--page < 0) page = pages.length - 1
    faqTooltip.innerHTML = `
    ${makePages()[page]}
    <a class="arrow" onclick=decrement()><img src="img/icons/left.png"></img></a>
    <a class="arrow" onclick=increment()><img src="img/icons/right.png"></img></a>
    `
}

faqTooltip.innerHTML = `
${makePages()[page]}
<a class="arrow" onclick=decrement()><img src="img/icons/left.png"></img></a>
<a class="arrow" onclick=increment()><img src="img/icons/right.png"></img></a>
`

const openTooltip = () => {    
    var indexes = read('index_color');
    const spacer = document.getElementById("faq-spacer")
    if (spacer.innerHTML == "") spacer.innerHTML = "<br>"
    else spacer.innerHTML = ""

    document.getElementById("faq-tooltip").classList.toggle("hidden");

    faqTooltip.innerHTML = `
    ${makePages()[page]}
    <a class="arrow" onclick=decrement()><img src="img/icons/left.png"></img></a>
    <a class="arrow" onclick=increment()><img src="img/icons/right.png"></img></a>
    `
    if (!document.getElementById("menu").classList.contains("hidden")) document.getElementById("menu").classList.add("hidden");
}