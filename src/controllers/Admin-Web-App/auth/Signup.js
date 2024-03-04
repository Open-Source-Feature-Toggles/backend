const User = require('../../../models/auth/user');
const { hash } = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../../helpers/Token-Helpers');
const {
  NameAlreadyExistsError,
} = require('../../../helpers/common-error-messages');
const {
  SignupValidation,
} = require('../../../validations/login-signup-validators');

async function SignUp(req, res) {
  try {
    let { username, password } = req.body;
    let userExists = await User.findOne({ username }).exec();
    if (userExists) {
      return NameAlreadyExistsError(res, 'Username');
    }
    let hashed_password = await hash(password, 10);
    let newUser = new User({
      username,
      password: hashed_password,
      created: new Date(),
    });
    let accessToken = generateAccessToken(newUser.username);
    let refreshToken = generateRefreshToken(newUser.username);
    newUser.refreshToken = refreshToken;
    await newUser.save();
    res.cookie('rjid', `${refreshToken}`, {
      maxAge: 7776000000,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

exports.SignUp = [SignupValidation, SignUp];
