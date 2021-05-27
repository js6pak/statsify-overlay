var searchField = document.getElementById("playerSearchField")
searchField.addEventListener('keyup', event => {
    if (event.keyCode === 13) playerSearch()
})

/* Player Search Bar in Header */
const playerSearch = async () => {
    const form = document.getElementById("playerSearchField")
    var player = form.value
    if (!player || player.length > 16) return;
    addPlayer(player)
    
    form.value = ""
}
