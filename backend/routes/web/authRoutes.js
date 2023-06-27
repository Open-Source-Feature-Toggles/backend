const express = require('express')
const router = express.Router() 

const LoginController = require('../../controllers/web/auth/Login')
const SignUpController = require('../../controllers/web/auth/Signup')
const LaunchAppController = require('../../controllers/web/auth/Launch-App')

router.post("/login", LoginController.login)

router.post("/sign-up", SignUpController.signUp)

router.post("/launch-app", LaunchAppController)

module.exports = router