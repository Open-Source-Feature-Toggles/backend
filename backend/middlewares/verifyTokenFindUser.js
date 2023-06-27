const { BadTokenError } = require('../helpers/common-error-messages')
const { verifyToken, getRefreshToken, generateAccessToken, } = require('../helpers/Token-Helpers')
const User = require('../models/auth/user')
const REFRESH_SECRET = process.env.REFRESH_SECRET


async function verifyRefreshToken (req, res, next) {
    try {
        try {
            let refreshToken = getRefreshToken(req)
            if (!refreshToken){
                return BadTokenError(res)
            }
            let payload = await verifyToken(refreshToken, REFRESH_SECRET)
            let findUser = await User.findOne({ username : payload.user })
            if (!findUser || findUser.refreshToken !== refreshToken ){
                return BadTokenError(res)
            }
            req.user = payload.user 
            req.accessToken = generateAccessToken(payload)
            req.userObject = findUser 
            return next()
        } catch (error) {   
            return BadTokenError(res)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)       
    }
}

module.exports = verifyRefreshToken