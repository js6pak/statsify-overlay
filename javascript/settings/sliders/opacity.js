const body = document.getElementById("body")
const header = document.getElementById("topnav")

const opacitySlider = document.getElementById("opacitySlider")
const opacityValue = document.getElementById("opacityValue")

opacitySlider.value = read("opacity") || read("opacity") != false ? (read("opacity") || 40) : 0
opacityValue.innerHTML = mcColor(`§f${read("opacity") == false ? 0 : read("opacity") || 40}%`)

const root = document.documentElement;
root.style.setProperty('--opacity', `rgba(0, 0, 0, ${opacitySlider.value/100})`);
root.style.setProperty('--header-opacity', `rgba(0, 0, 0, ${(opacitySlider.value/100)+0.1})`);

opacitySlider.oninput = () => {
    opacityValue.innerHTML = mcColor(`§f${opacitySlider.value}%`)
    root.style.setProperty('--opacity', `rgba(0, 0, 0, ${(opacitySlider.value/100)})`);
    root.style.setProperty('--header-opacity', `rgba(0, 0, 0, ${(opacitySlider.value/100)+0.1})`);
    
    write("opacity", (opacitySlider.value))
}