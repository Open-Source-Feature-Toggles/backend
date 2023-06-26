const { BadTokenError, NoUserFoundError } = require('../helpers/common-error-messages')
const { getAccessToken, getRefreshToken, generateAccessToken, verifyToken } = require('../helpers/Token-Helpers')
const User = require('../models/auth/user')
const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

async function ProtectAuthRoutes (req, res, next) {
    try {
        let accessToken = getAccessToken(req)
        let refreshToken = getRefreshToken(req)
        if (!accessToken && !refreshToken){
            return BadTokenError(res)
        }
        if (accessToken){
            try {
                let payload = await verifyToken(accessToken, ACCESS_SECRET)
                req.user = payload.user
                return next()
            } catch (err) {
                if (!refreshToken){
                    return BadTokenError(res)
                }
            }
        }
        if (refreshToken){
            try {
                let payload = await verifyToken(refreshToken, REFRESH_SECRET)
                let findUser = await User.findOne({ username : payload.user }).exec()
                if (!findUser) {
                    return NoUserFoundError(res) 
                }
                if (findUser.refreshToken === refreshToken){
                    req.user = payload.user
                    req.accessToken = { accessToken : generateAccessToken(payload) }
                    return next()
                }
                return BadTokenError(res)
            } catch (error) {
                console.error(error)
                return BadTokenError(res)
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}





module.exports = ProtectAuthRoutes


