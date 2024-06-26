const { verifyRefreshToken } = require('../../../middlewares/auth');
const {
  ResourceNotFoundError,
} = require('../../../helpers/common-error-messages');

async function LogoutUser(req, res) {
  try {
    if (!req.userObject) {
      throw new Error('Missing userObject');
    }
    let user = req.userObject;
    await user.updateOne({ $unset: { refreshToken: 1 } }).exec();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = LogoutUser;
