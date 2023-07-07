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

function PasswordConfirmPasswordError ( res ) {
    return res.status(409).json({ errors : "Password and Confirm Password Must Match" })
}

function MissingApiKeyError ( res ) {
    return res.status(404).json({ errors : "No Api Key Provided" })
}

function BadApiKeyError ( res ) {
    return res.status(401).json({ errors : "Bad Api Key" })
}


module.exports = {
    BadTokenError, 
    BadPasswordError, 
    ResourceNotFoundError, 
    NameAlreadyExistsError, 
    PasswordConfirmPasswordError,
    MissingApiKeyError,  
    BadApiKeyError, 
}