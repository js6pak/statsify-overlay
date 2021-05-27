const Store = require('electron-store');
const store = new Store();

const write = (key, value) => {
    store.set(key, value)
    return value;
}

const read = key => {
    var val = store.get(key);
    if (val == false) return false
    else if (val == 0) return 0
    else return val || undefined
}

const deleteFromStorage = key => store.delete(key)

/* In Settings */
const sendHeader = (body, success = false) => {
    var type = success ? 'success' : 'error'
    document.getElementById("bannerMessage").innerHTML = `
    <div class="${type}">
        <img class="${type}-img" src="${success ? './img/icons/check.png' : './img/icons/error.png'}" />
        <div class="${type}-header">${success ? 'Operation Successful' : 'An Unexpected Error Occured'}</div>
        <br>
        <div class="${type}-content">
        <p>${body}</p>
        </div>
    </div>
  `

    setTimeout(() => document.getElementById("bannerMessage").innerHTML = `<h1>Settings</h1><br>`, 10000)
}






