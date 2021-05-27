const slider = data => {
    var hover;
    if (data.type.hover) hover = `<span title="${data.type.hover}" style="-webkit-app-region: no-drag">`

    var html = `
        <div class="rangeSliders" style="-webkit-app-region: no-drag">
            <p id="${data.type.value}Value">${hover || ""}${data.title}*: ${data.type.default}${data.type.unit}</p>
            <input type="range" value=${data.type.default} min="${data.type.range[0]}" max="${data.type.range[1]}" class="rangeSlider" id="${data.type.value}Slider">
        </div>
    `
    return html
}

const sliderJS = data => {
    var hover;
    if (data.type.hover) hover = `<span title="${data.type.hover}" style="-webkit-app-region: no-drag">`

    const value = document.getElementById(`${data.type.value}Value`)
    const slider = document.getElementById(`${data.type.value}Slider`)

    slider.value = read(`${data.type.section}_${data.type.value}`) || data.type.default;
    value.innerHTML = `${hover || ""}${data.title}*: ${slider.value}${data.type.unit}`

    slider.oninput = () => {
        value.innerHTML = `${hover || ""}${data.title}*: ${slider.value}${data.type.unit}`
        write(`${data.type.section}_${data.type.value}`, slider.value)

        if (data.callback) data.callback();
    }
} 