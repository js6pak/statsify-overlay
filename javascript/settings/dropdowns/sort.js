/* Drop down menu for switching between what statistic to sort players by */
var sortMode = read("sort") || "threat"

if (sortMode == "threat") document.getElementById("threatOption").selected = "selected"
else if (sortMode == "level") document.getElementById("levelOption").selected = "selected"
else if (sortMode == "hLevel") document.getElementById("hLevelOption").selected = "selected"
else if (sortMode == "fkdr") document.getElementById("fkdrOption").selected = "selected"
else document.getElementById("wsOption").selected = "selected"

const sortSwitcher = () => {
    sortMode = document.getElementById("sortMode").value

    write("sort", sortMode)
    tableUpdater()
}