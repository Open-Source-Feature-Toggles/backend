function BadTokenError (res) {
    return res.status(401).json({ errors : "Bad-Token" })
}

function ResourceNotFoundError (res, resource) {
    return res.status(404).json({ errors : `${resource} not found` })
}

function NameAlreadyExists (res, fieldType) {
    return res.status(409).json({ errors : `This ${fieldType} already exists` })
}


module.exports = {
    BadTokenError, 
    ResourceNotFoundError, 
    NameAlreadyExists, 
}