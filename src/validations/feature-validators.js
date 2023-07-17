const { body } = require('express-validator')
const ValidationError = require('./validation-error')

const Name_ProjectName_Validator = [
    body("featureName")
        .trim()
        .notEmpty().withMessage("Missing Feature Name")
        .escape(),
    body("projectName")
        .trim()
        .notEmpty().withMessage("Missing Project Name")
        .escape(),
]

const Make_New_Feature_Validator = [
    body("featureName")
        .trim()
        .notEmpty().withMessage("Missing Feature Name")
        .escape(),
    body("description")
        .trim()
        .escape(), 
    body("initialVariableKey")
        .trim()
        .notEmpty().withMessage("Missing Variable Key")
        .escape(), 
    body("projectName")
        .trim()
        .notEmpty().withMessage("Missing Project Name")
        .escape(), 
    body("featureVariableName")
        .trim()
        .notEmpty().withMessage("Missing Feature Variable's Name")
        .escape(),
]


exports.Name_ProjectName_Validation = [
    Name_ProjectName_Validator, 
    ValidationError, 
]

exports.Make_New_Feature_Validation = [
    Make_New_Feature_Validator, 
    ValidationError, 
]