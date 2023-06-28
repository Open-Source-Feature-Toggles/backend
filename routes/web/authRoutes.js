const express = require('express')
const router = express.Router() 

// Middleware 
const { ProtectAuthRoutes } = require('../../middlewares/auth')


// Controllers 
const { Login } = require('../../controllers/web/auth/Login')
const { SignUp } = require('../../controllers/web/auth/Signup')
const LaunchAppController = require('../../controllers/web/auth/Launch-App')
const { LogoutUser } = require('../../controllers/web/auth/Logout')

router.post("/login", Login)

router.post("/sign-up", SignUp)

router.post("/launch-app", ProtectAuthRoutes, LaunchAppController)

router.delete("/logout", LogoutUser)

module.exports = router