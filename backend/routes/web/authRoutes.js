const express = require('express')
const router = express.Router() 

const LoginController = require('../../controllers/auth/Login')

router.post("/login", LoginController.login)


module.exports = router