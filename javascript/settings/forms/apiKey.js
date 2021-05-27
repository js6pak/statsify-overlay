/* Input field for manually setting API key */
const apiKeySubmitter = async () => {
    var key = document.getElementById("apiKeyField").value
    if (!key) return;
    var keyStatus = await getKey(key)
    if (keyStatus.valid == false) {
        return sendHeader("The key you provided was not a valid API key.", false)
    } else {
        sendHeader("Your API key has been set successfully.", true)
        document.getElementById("apiKeyField").value = key;
        write("api", key)
    }
}