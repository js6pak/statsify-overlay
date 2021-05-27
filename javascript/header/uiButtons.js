const toggleMenu = () => {
    document.getElementById("menu").classList.toggle("hidden");
    document.getElementById("settings").classList.remove("hidden")
    document.getElementById("indepth-options").classList.add("hidden")

    if (!document.getElementById("faq-tooltip").classList.contains("hidden")) {
        document.getElementById("faq-tooltip").classList.add("hidden");
        const spacer = document.getElementById("faq-spacer")
        if (spacer.innerHTML == "") spacer.innerHTML = "<br>"
        else spacer.innerHTML = ""
    }
    
    if (read("resizeEnabled") && (document.getElementById("menu").classList.item(1) || "None") == "None") {
        var window = remote.getCurrentWindow()
        var size = { x: window.getSize()[0], y: 460 }
        var window = remote.getCurrentWindow()
        window.setSize(size.x, size.y)
    }
}

const closeInDepthSettings = () => {
    toggleMenu()
    toggleMenu()
}

document.onkeydown = event => {
    if(document.getElementById("menu").classList.contains("hidden")) return;
    event = event || window.event;
    var isEscape = false;
    if ("key" in event) isEscape = (event.key === "Escape" || event.key === "Esc");
    else isEscape = (event.keyCode === 27)

    if (isEscape) toggleMenu()
};