const semver = require('semver');

write("version", "2.7.2")

const getLatestReleases = async () => {
    return new Promise(async resolve => {
        const body = await fetch('https://api.github.com/repos/imconnorngl/overlay/releases/latest')
        try {
            var data = await body.json();
        } catch {
            resolve({ outage: true })
        }

        resolve(data)
    })
}

(async () => {
    const latestRelease = await getLatestReleases();
    if (latestRelease.url) {
        if (read("version") == undefined) write("version", latestRelease.tag_name)
        else {
            var vers = read("version")
            if (semver.gt(latestRelease.tag_name, vers))
                updateAlert(latestRelease.name, latestRelease.body, latestRelease.tag_name)
        }
    }
})()