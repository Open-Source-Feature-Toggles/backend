const User = require('../../../models/auth/user')
const { compare } = require('bcrypt')
const { generateAccessToken, 
        generateRefreshToken 
} = require('../../../helpers/Token-Helpers')
const { BadPasswordError, ResourceNotFoundError  } = require('../../../helpers/common-error-messages')
const { LoginValidation } = require('../../../middlewares/form-validation/login-signup-validators')

async function Login (req, res) {
    try {
        let { username, password } = req.body
        let userExists = await User.findOne({ username }).exec()
        if (!userExists) { 
            return ResourceNotFoundError(res, "User")
        }
        let validPassword = await compare(password, userExists.password)
        if (!validPassword) {
            return BadPasswordError(res)
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


exports.Login = [
    LoginValidation, 
    Login
]
