const express = require('express')
const router = express.Router() 

// Middleware 
const { ProtectAuthRoutes } = require('../../middlewares/auth')


// Controllers 
const LoginController = require('../../controllers/web/auth/Login')
const SignUpController = require('../../controllers/web/auth/Signup')
const LaunchAppController = require('../../controllers/web/auth/Launch-App')
const { LogoutUser } = require('../../controllers/web/auth/Logout')

router.post("/login", LoginController.login)

router.post("/sign-up", SignUpController.signUp)

router.post("/launch-app", ProtectAuthRoutes, LaunchAppController)

router.delete("/logout", LogoutUser)

module.exports = router