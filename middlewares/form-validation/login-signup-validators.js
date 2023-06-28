const { body } = require('express-validator')
const ValidationError = require('./validation-error')
const { PasswordConfirmPasswordError } = require('../../helpers/common-error-messages')

const LoginValidator = [
    body("username")
        .trim()
        .isLength({ min : 8 }).withMessage("Username must be 8 characters long")
        .escape(),
    body("password")
        .trim()
        .isLength({ min : 8 }).withMessage("Password must be 8 characters long"), 
]

const SignupValidator = [
    body("username")
        .trim()
        .isLength({ min : 8 }).withMessage("Username must be 8 characters long")
        .escape(),
    body("password")
        .trim()
        .isLength({ min : 8 }).withMessage("Password must be 8 characters long"), 
    body("confirm_password")
        .trim()
        .isLength({ min : 8 }).withMessage("Confirm Password must be 8 characters long"), 
    function (req, res, next) {
        let { password, confirm_password } = req.body 
        if (password !== confirm_password) {
            return PasswordConfirmPasswordError(res)
        }
        return next()
    }
]


exports.LoginValidation = [
    LoginValidator, 
    ValidationError, 
]

exports.SignupValidation = [
    SignupValidator, 
    ValidationError, 
]