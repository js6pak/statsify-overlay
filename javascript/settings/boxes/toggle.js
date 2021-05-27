const toggle = data => {
    var hover;
    if (data.type.hover) hover = `<span title="${data.type.hover}" style="-webkit-app-region: no-drag">`

    var html = `
        <label class="switch" style="-webkit-app-region: no-drag">
            <input type="checkbox" id="${data.type.value}Toggle">
            <span class="slider round"></span>
            <p class="switch-text">${hover || ""}${data.title}*: </span></p>
        </label>
    `
    return html
}

const toggleJS = data => {
    const toggle = document.getElementById(`${data.type.value}Toggle`)
    toggle.checked = read(`${data.type.section}_${data.type.value}`) || data.type.default;

    toggle.onclick = () => {
        var status = toggle.checked
        write(`${data.type.section}_${data.type.value}`, status);

        if (data.callback) data.callback();
    }
}