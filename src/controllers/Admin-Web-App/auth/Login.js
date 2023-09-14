const User = require('../../../models/auth/user')
const { compare } = require('bcrypt')
const { generateAccessToken, 
        generateRefreshToken, 
        verifyToken
} = require('../../../helpers/Token-Helpers')
const { BadPasswordError, ResourceNotFoundError  } = require('../../../helpers/common-error-messages')
const { LoginValidation } = require('../../../validations/login-signup-validators')
const REFRESH_SECRET = process.env.REFRESH_SECRET

async function Login (req, res) {
    try {
        let { username, password } = req.body
        let userExists = await User.findOne({ username }).exec()
        if (!userExists) { 
            return ResourceNotFoundError(res, "Username")
        }
        let validPassword = await compare(password, userExists.password)
        if (!validPassword) {
            return BadPasswordError(res)
        } 
        let refreshToken
        try {
            if (userExists.refreshToken === undefined){ throw new Error('No JWT') }
            await verifyToken(userExists.refreshToken, REFRESH_SECRET)
            refreshToken = userExists.refreshToken
        } catch (error) {
            refreshToken = generateRefreshToken(userExists.username)
            userExists.refreshToken = refreshToken
            await userExists.save()
        }
        let accessToken = generateAccessToken(userExists.username)
        res.cookie('rjid', `${refreshToken}`, { maxAge: 7776000000, httpOnly: true, secure: true, sameSite : 'None' })
        res.status(200).json({ accessToken })
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


exports.Login = [
    LoginValidation, 
    Login
]
