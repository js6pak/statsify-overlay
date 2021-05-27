const fullscreen = () => {
    if (process.platform !== 'win32')
        return;

    const img = document.getElementById("fullscreener")

    img.src = "img/icons/loading.gif"

    python(fileJoin.join(__dirname, 'python/fullscreen/fullscreen.exe'), (err, data) => {
        img.src = "img/icons/fullscreen.png"
        if (err) console.log(err);
    });
}