function BadTokenError (res) {
    return res.status(401).json({ errors : "Bad Token" })
}

function BadPasswordError (res) {
    return res.status(401).json({ errors : "Bad Password" })
}

function ResourceNotFoundError (res, resource) {
    return res.status(404).json({ errors : `${resource} not found` })
}

function NameAlreadyExistsError (res, fieldType) {
    return res.status(409).json({ errors : `This ${fieldType} already exists` })
}


module.exports = {
    BadTokenError, 
    BadPasswordError, 
    ResourceNotFoundError, 
    NameAlreadyExistsError, 
}