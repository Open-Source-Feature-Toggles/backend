function CachedResourceValid (res) {
    return res.sendStatus(304)
}





module.exports = {
    CachedResourceValid, 
}