const { validationResult } = require('express-validator')

function ValidationError (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        let messages = errors.array().map( (error) => {
            return error.msg
        })
        return res.status(400).json({ errors : messages })
    }
    next()
}

module.exports = ValidationError