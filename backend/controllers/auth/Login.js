const { body, validationResult } = require('express-validator')
const User = require('../../models/auth/user')
const { compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const { generateAccessToken, 
        generateRefreshToken } = require('./utils/generateTokens')

exports.login = [ 
    body("username")
        .trim()
        .isLength({ min : 8 }).withMessage("Username must be 8 characters long")
        .escape(),
    body("password")
        .trim()
        .isLength({ min : 8 }).withMessage("Password must be 8 characters long"), 
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors : errors.array() })
            }
            let { username, password } = req.body
            let userExists = await User.findOne({ username }).exec()
            if (!userExists) { 
                return res.status(404).json({ errors : "User not found" }) 
            }
            let validPassword = await compare(password, userExists.password)
            if (!validPassword) {
                return res.status(409).json({ errors : "Invalid Password" })
            } 
            let accessToken = generateAccessToken(userExists.username)
            let refreshToken = generateRefreshToken(userExists.username)
            userExists.refreshToken = refreshToken
            await userExists.save()
            res.cookie('rjid', `${refreshToken}`, { maxAge: 604800000, httpOnly: true, secure: true })
            res.status(200).json({ accessToken })
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    } 
]
