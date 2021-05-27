const reset = data => {
    (data.extraOptions || []).forEach(option => {
        write(`${option.type.section}_${option.type.value}`, option.type.default)
    })
}