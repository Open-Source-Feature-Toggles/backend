const { BadTokenError, ResourceNotFoundError } = require('../helpers/common-error-messages')
const { getAccessToken, getRefreshToken, generateAccessToken, verifyToken } = require('../helpers/Token-Helpers')
const User = require('../models/auth/user')
const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET


async function verifyAccessToken (req, res, next) {
    try {
        let accessToken = getAccessToken(req)
        if (!accessToken){
            return next()
        }
        try {
            let payload = await verifyToken(accessToken, ACCESS_SECRET)
            req.user = payload.user 
            return next()
        } catch (error) {
            return next()
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function verifyRefreshToken (req, res, next) {
    try {
        try {
            // If verifyAccessToken successful, skip refresh token auth
            if (req.user){
                return next()
            }
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

const ProtectAuthRoutes = [
    verifyAccessToken, 
    verifyRefreshToken
]


module.exports = {
    verifyAccessToken, 
    verifyRefreshToken, 
    ProtectAuthRoutes
}


