const { body, validationResult } = require('express-validator')
const User = require('../../../models/auth/user')
const { hash } = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../../../helpers/Token-Helpers')
const { NameAlreadyExistsError } = require('../../../helpers/common-error-messages')

exports.signUp = [
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
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors : errors.array() })
            }
            let { 
                username, 
                password, 
                confirm_password
            } = req.body
            let userExists = await User.findOne({ username }).exec()
            if (userExists){
                return NameAlreadyExistsError(res, "Username")
            }
            if (password !== confirm_password){
                return res.status(409).json({ errors: "Password and Confirm Passowrd must match" })
            }
            let hashed_password = await hash(password, 10) 
            let newUser = new User({
                username,
                password : hashed_password, 
                created : new Date(), 
            })
            let accessToken = generateAccessToken(newUser.username)
            let refreshToken = generateRefreshToken(newUser.username)
            newUser.refreshToken = refreshToken 
            await newUser.save()
            res.cookie('rjid', `${refreshToken}`, { maxAge: 604800000, httpOnly: true, secure: true })
            res.status(200).json({ accessToken })
        } catch (error){
            console.error(error)
            res.sendStatus(500)
        }
    }
]