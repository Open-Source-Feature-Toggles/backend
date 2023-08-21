function prettyFormatDate (dateString) {
    let date = new Date(dateString)
    date = `${date.getMonth() + 1}/${date.getDay()}/${date.getFullYear()}`
    return date
}

module.exports = prettyFormatDate