const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const { compare } = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET


exports.refresh_middleware = async function (req, res) {
    let { rjid } = req.cookies 
    if (!rjid) {
        return res.status(404).json({ errors : "Bad-Token" })
    }
    try {
        res.status(200)
    } catch (error) {
        res.status(500)
    }
}


exports.jwt_middleware = async function (req, res, next) {

}


exports.startup = async function (req, res) {
    let { rjid } = req.cookies
    if (!rjid) {
        return res.status(409).json({ errors : "No-Refresh-Token" })
    }
    verify(rjid, REFRESH_SECRET, async (err, payload) => {
        if (err){
            return res.status(409).json({ errors: "Bad-Token" })
        }
        let findUser = await User.findOne({ username : payload.user }).exec()
        if (findUser.refreshToken === rjid){
            return res.status(200).json({ accessToken : generateAccessToken(payload) })
        }
        else if (findUser.refreshToken){
            await User.findByIdAndUpdate(findUser._id, { $unset : { refreshToken : 1 } }).exec()
        }
        return res.status(404).json({ errors : "Bad-Token" })
    })
}




exports.no_name = async function (req, res, next) {
    let { rjid } = req.cookies
    let authHeader = req.headers['authorization']
    let accessToken = authHeader && authHeader.split(" ")[1] 
    if (!accessToken && !rjid){
        return res.status(409).json({ errors: "Bad-Token" })
    }
    if (accessToken){
        verify(accessToken, ACCESS_SECRET, (err, payload) => {
            if (err) { return }
            req.user = payload
            next()
        })
    }
    if ( rjid ) {
        verify(rjid, REFRESH_SECRET, async (err, payload) => {
            if (err){
                return res.status(409).json({ errors: "Bad-Token" })
            }
            let findUser = await User.findOne({ username : payload.user }).exec()
            if (findUser.refreshToken === rjid){
                
                return res.status(200).json({ accessToken : generateAccessToken(payload) })
            }
            else if (findUser.refreshToken){
                await User.findByIdAndUpdate(findUser._id, { $unset : { refreshToken : 1 } }).exec()
            }
            return res.status(404).json({ errors : "Bad-Token" })
        })
    }
}


function generateAccessToken (payload) {
    return sign({ user : payload }, ACCESS_SECRET, { 'expiresIn' : '15m' })
}

function generateRefreshToken (payload) {
    return sign({ user: payload }, REFRESH_SECRET, { 'expiresIn' : '7d' })
}

exports.login = [ 
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
            res.cookie('rjid', `${refreshToken}`, { maxAge: 604800000, httpOnly: true, secure: true }); 
            res.status(200).json({ accessToken })
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    } 
]

exports.test = async function (req, res) {
    res.json({ message : "hello world" })
}