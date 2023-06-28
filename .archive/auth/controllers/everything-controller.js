const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const SECRET = process.env.SECRET

function generateToken (user) {
    return sign( {user}, process.env.SECRET, { expiresIn : '30s' })
}

class AuthenticationController {
    
    signUp = 
        [
            body("username")
                .trim()
                .notEmpty().withMessage("Username cannot be empty")
                .isLength({ min : 8 }).withMessage("Username must be at least 8 characters long")   
                .escape(),
            body("password")
                .trim()
                .notEmpty().withMessage("Password cannot be empty")
                .isLength({ min : 8 }).withMessage("Password must be at least 8 characters long"), 
            async function (req, res) {
                try {
                    const errors = validationResult(req)
                    console.log(req.body)
                    if (!errors.isEmpty()){
                        return res.status(400).json({ errors: errors.array() })
                    }
                    let { username, password } = req.body
                    let existingUser = await User.findOne({ username }).exec()
                    if (existingUser){ return res.status(400).json({ error : "username-taken" }) }
                    let hashed_password = await bcrypt.hash(password, 10)
                    let newUser = new User({
                        username, 
                        password : hashed_password,    
                        created : new Date(), 
                    })
                    await newUser.save()
                    res.sendStatus(200)
                } catch (error) {
                    console.error(error)
                    res.sendStatus(500)
                }
            } 
        ]

    login = 
        [  
            body("username")
                .trim()
                .notEmpty().withMessage("Username cannot be empty")
                .isLength({ min : 8 }).withMessage("Username must be 8 characters long")
                .escape(),
            body("password")
                .trim()
                .notEmpty().withMessage("Password cannot be empty")
                .isLength({ min : 8 }).withMessage("Password must be 8 characters long"), 
            async function (req, res) {
                try {
                    let errors = validationResult(req) 
                    if (!errors.isEmpty()){
                        return res.status(400).json({ errors: errors.array() })
                    }
                    let { username, password } = req.body
                    let existingUser = await User.findOne({ username }).exec()
                    if (!existingUser) { return res.status(404).json({ error : "user-dne" }) }
                    let passOkay = await bcrypt.compare(password, existingUser.password)
                    if (!passOkay){ return res.status(400).json({ error: "incorrect-password" }) }
                    let accessToken = generateToken(username)
                    let refreshToken = sign({ username }, process.env.REFRESH_SECRET)
                    existingUser.refreshToken = refreshToken
                    console.log(refreshToken)
                    await existingUser.save()
                    res.status(200).json({ accessToken, refreshToken })
                } catch (error) {
                    res.sendStatus(500)
                    console.log(error)
                }
            }
        ]

    authenticateToken (req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        if (token === null) { return res.sendStatus(401) }
        console.log(authHeader)
        console.log(token)
        verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.status(403).json({ error : "invalid-token" })
            req.user = user.user
            next()
        })
    } 

    async refreshToken (req, res) {
        let refreshToken = req.body.token 
        let username = req.body.username
        if (refreshToken === null ) { return res.status(401).json({ error: "no-token-provided" }) }
        if (username === null ) { return res.status(401).json({ error: "no-usernam-provided" }) }
        let user = await User.findOne({ username })
        if (!user) { return res.status(401).json({ error : "no-user-found" }) } 
        console.log(user)
        if (refreshToken !== user.refreshToken) { 
            return res.status(403).json({ error : "db-token-and-user-token-dont-match" })
        }
        verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) { return res.status(403).json({error : "invalid-token"}) }
            const accessToken = generateToken(user.username)
            res.json({ accessToken })
        })
    }

    async logout (req, res) {
        try {
            let username = req.body.username 
            if (username === null) { return res.status(401).json({ error : "no-username-provided" }) }
            let user = await User.findOne({ username }).exec()
            if (!user) { return res.status(404).json({ error : "user-does-not-exist" }) } 
            if (!user.refreshToken) { return res.status(404).json({ error: "refresh-token-dne" }) }
            await User.findByIdAndUpdate(user._id, { $unset : { refreshToken : 1 } }).exec()
            res.send(200)
        } catch (error) {
            res.status(500)
            res.error(error)
        }
    }

}

module.exports = new AuthenticationController()