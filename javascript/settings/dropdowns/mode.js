/* Drop down menu for switching between game modes */
var mode = read("mode") || "overall"
document.getElementById(`${mode}Option`).selected = "selected"

const modeSwitcher = () => {
    mode = document.getElementById("modeSwitch").value

    write("mode", mode)
    tableUpdater()
}