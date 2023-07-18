const express = require('express')
const router = express.Router() 

// Middleware 
const { 
    verifyRefreshToken 
} = require('../../middlewares/auth')


// Controllers 
const { Login } = require('../../controllers/Admin-Web-App/auth/Login')
const { SignUp } = require('../../controllers/Admin-Web-App/auth/Signup')
const LaunchAppController = require('../../controllers/Admin-Web-App/auth/Launch-App')
const LogoutUser  = require('../../controllers/Admin-Web-App/auth/Logout')

router.post("/login", Login)

router.post("/sign-up", SignUp)

router.post("/launch-app", verifyRefreshToken, LaunchAppController)

router.delete("/logout", verifyRefreshToken, LogoutUser)

module.exports = router