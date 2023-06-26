const express = require('express')
const router = express.Router() 

const LoginController = require('../../controllers/web/auth/Login')
const SignUpController = require('../../controllers/web/auth/Signup')


router.post("/login", LoginController.login)

router.post("/sign-up", SignUpController.signUp)

module.exports = router