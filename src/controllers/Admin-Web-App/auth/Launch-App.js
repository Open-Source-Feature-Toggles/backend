const { generateAccessToken } = require('../../../helpers/Token-Helpers')

/* 
*   This function is called by the client at startup, and
*   simply checks to see if the client has a valid Refresh  
*   Token in their cookies. If so, they are sent a valid 
*   AccessToken
*/ 

async function LaunchApplication (req, res) {
    try {  
        return res.status(200).json({ accessToken : generateAccessToken(req.user) })
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

module.exports = LaunchApplication