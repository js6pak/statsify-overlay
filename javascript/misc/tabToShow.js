var tabTimeout;

const tabToShow = async () => {
    if(process.platform == 'darwin') return;

    const { stdout } = await python_output(fileJoin.join(__dirname, 'python/tabToShow/tabToShow.exe'))
    if (stdout.toString().trim() == "tab") {
        if (read("tabToShow")) {
            showWindow()
        }
    }

    tabToShow()
}

tabToShow()