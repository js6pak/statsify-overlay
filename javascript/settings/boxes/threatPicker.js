const Pickr = require('@simonwep/pickr');

const create = () => {
    html = `
    <p>${mcColor("§9Threat Formula §8» (§fStar§7*§eFKDR§7^§62§8)§7/§f10")}</p>
    <div id="pickers">
        ${read('index_color').map((obj, index) => `
            <div class="indexCard">
                <input class="indexInput" id="colorInput${index}" type="number" value="${obj.rating}" placeholder="${obj.rating}"></input>
                <div>
                    <button class="color-picker${index} color-picker"></button>
                    <button class="colorRemove" onclick="removeColor(${index})">X</button>
                </div>
            </div>
        `).join('<br>')}
    </div>`
    html += `<button class="addButton" onclick="addColor()">+</button>`

    return html;
}

const colorPickerJS = data => {
    read('index_color').forEach((obj, index) => {
        const input = document.getElementById(`colorInput${index}`);
        input.oninput = () => {
            if (index === 0) return input.value = 0;
        };
        
        input.onblur = () => {
            if (!input.value) input.value = 0;

            let current = read('index_color');
 
            current[index].rating = input.value;
            current = current.sort((a, b) => a.rating - b.rating)
            write('index_color', current);

            const info = document.getElementById('options-area')
            info.innerHTML = create();
            colorPickerJS()
        }

        const pickr = Pickr.create({
            el: `.color-picker${index}`,
            id: `statpixel`,
            theme: 'monolith', // or 'monolith', or 'nano'
            closeOnScroll: true,
            comparison: false,
            default: obj.color,
            padding: 10,
            lockOpacity: true,
            position: 'right-middle',
            swatches: [
                '#FF5555',
                '#FFFF55',
                '#55FF55',
                '#55FFFF',
                '#5555FF',
                '#FF55FF',
                '#FFFFFF',
                '#555555',
                '#AA0000',
                '#FFAA00',
                '#00AA00',
                '#00AAAA',
                '#0000AA',
                '#AA00AA',
                '#AAAAAA',
                '#000000',
            ],

            components: {
        
                // Main components
                preview: true,
                hue: true,
                // Input / output Options
                interaction: {
                    input: true,
                    hex: false,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    cancel: true,
                    clear: false,
                    save: true,
                }
            },
        });
                
        pickr.on('hide', (instance) => {
            let current = read('index_color');
 
            current[index].color = `#${instance["_color"].toHEXA().join('')}`;
            write('index_color', current);
        })
        
        pickr.on('cancel', instance => {
            let current = read('index_color');
            pickr.setColor(current[index].color)
            pickr.hide()
        });

        pickr.on('clear', instance => {
            pickr.setColor(instance.options.default);
            removeColor(index);
        });
    })
}

const addColor = () => {
    const scores = read('index_color')
    const lastIndex = scores.length - 1;

    if(scores.length >= 14) return;
    scores[lastIndex + 1] = { rating: Number(scores[lastIndex].rating+1), color: "#FFFFFF" };
    write('index_color', scores)
    const info = document.getElementById('options-area')
    info.innerHTML = create();
    colorPickerJS()
}

const removeColor = index => {
    index = Number(index);
    if (index == 0) return;
    const scores = read('index_color')
    scores.splice(index, 1);

    write('index_color', scores)
    const info = document.getElementById('options-area')
    info.innerHTML = create();
    colorPickerJS()
}