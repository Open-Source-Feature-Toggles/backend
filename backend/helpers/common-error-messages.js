function BadTokenError (res) {
    return res.status(401).json({ errors : "Bad-Token" })
}

function NoUserFoundError (res) {
    return res.status(404).json({ errors : "User Not Found" })
}


module.exports = {
    BadTokenError, 
    NoUserFoundError, 
}