const { body } = require('express-validator')
const ValidationError = require('./validation-error')

const NameValidator = [
    body("projectName")
    .trim()
    .notEmpty().withMessage("Missing Project Name")
    .escape()
]


exports.projectValidation = [
    NameValidator, 
    ValidationError, 
]