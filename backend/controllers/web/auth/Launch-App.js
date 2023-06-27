const { BadTokenError } = require('../../../helpers/common-error-messages')
const User = require('../../../models/auth/user')
const { getRefreshToken, generateAccessToken, verifyToken } = require('../../../helpers/Token-Helpers')
const REFRESH_SECRET = process.env.REFRESH_SECRET

/* 
*   This function is called by the client at startup, and
*   simply checks to see if the client has a valid Refresh  
*   Token in their cookies. If so, they are sent a valid 
*   AccessToken
*/ 

async function LaunchApplication (req, res) {
    try {   
        try {
            let refreshToken = getRefreshToken(req)
            if (!refreshToken){
                return BadTokenError(res)
            }
            let payload = await verifyToken(refreshToken, REFRESH_SECRET)
            let findUser = await User.findOne({ username : payload.user })
            if (!findUser || findUser.refreshToken !== refreshToken) {
                return BadTokenError(res)
            }
            return res.status(200).json({ accessToken : generateAccessToken(payload) })
        }
        catch (error) {
            console.error(error)
            return BadTokenError(res)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

module.exports = LaunchApplication