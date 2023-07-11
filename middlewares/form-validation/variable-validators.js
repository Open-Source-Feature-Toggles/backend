const { body } = require('express-validator')
const ValidationError = require('./validation-error')

const MakeNewVariableValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Missing Variable Name")
        .escape(), 
    body("active")
        .trim()
        .notEmpty().withMessage("Missing Variable Status")
        .isBoolean()
        .escape(), 
    body("parentFeature")
        .trim()
        .notEmpty().withMessage("Missing Parent Feature Name")
        .escape(), 
    body("parentProject")
        .trim()
        .notEmpty().withMessage("Missing Parent Project Name")
        .escape(), 
]

const DeleteVariableValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Missing Variable Name")
        .escape(), 
    body("parentFeature")
        .trim()
        .notEmpty().withMessage("Missing Parent Feature Name")
        .escape(), 
    body("parentProject")
        .trim()
        .notEmpty().withMessage("Missing Parent Project Name")
        .escape(), 
]

const UpdateStatusValidator = [
    body("name") 
        .trim()
        .notEmpty().withMessage("Missing Variable Name")
        .escape(), 
    body("parentFeature")
        .trim()
        .notEmpty().withMessage("Missing Parent Feature Name")
        .escape(), 
    body("parentProject")
        .trim()
        .notEmpty().withMessage("Missing Parent Project Name")
        .escape(), 
]


exports.MakeNewVariableValidation = [
    MakeNewVariableValidator, 
    ValidationError, 
]

exports.DeleteVariableValidation = [
    DeleteVariableValidator, 
    ValidationError, 
]

exports.UpdateStatusValidation = [
    UpdateStatusValidator, 
    ValidationError, 
]