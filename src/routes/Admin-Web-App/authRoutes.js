const express = require('express')
const router = express.Router() 

// Middleware 
const { ProtectAuthRoutes } = require('../../middlewares/auth')


// Controllers 
const { Login } = require('../../controllers/Admin-Web-App/auth/Login')
const { SignUp } = require('../../controllers/Admin-Web-App/auth/Signup')
const LaunchAppController = require('../../controllers/Admin-Web-App/auth/Launch-App')
const { LogoutUser } = require('../../controllers/Admin-Web-App/auth/Logout')

router.post("/login", Login)

router.post("/sign-up", SignUp)

router.post("/launch-app", ProtectAuthRoutes, LaunchAppController)

router.delete("/logout", LogoutUser)

module.exports = router