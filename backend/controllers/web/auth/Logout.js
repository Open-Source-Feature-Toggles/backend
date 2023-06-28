const { verifyRefreshToken } = require('../../../middlewares/auth')

async function LogoutUser (req, res) {
    try {
        if (!req.userObject){
            throw new Error("Missing userObject")
        }
        let user = req.userObject
        await user.updateOne({ $unset : { refreshToken : 1 } }).exec()
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


exports.LogoutUser = [
    verifyRefreshToken, 
    LogoutUser
]