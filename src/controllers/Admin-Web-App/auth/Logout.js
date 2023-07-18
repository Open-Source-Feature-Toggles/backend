const { verifyRefreshToken } = require('../../../middlewares/auth')
const { ResourceNotFoundError } = require('../../../helpers/common-error-messages')

async function LogoutUser (req, res) {
    debugger
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


module.exports = LogoutUser