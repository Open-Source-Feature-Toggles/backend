const express = require('express')
const router = express.Router() 
const AuthenticationController = require('../controllers/everything-controller')


router.post("/login", AuthenticationController.login)

router.post("/signup", AuthenticationController.signUp)

router.get("/hi-there", AuthenticationController.authenticateToken, (req, res) => {
    res.send(`nice ${req.user}`)
})

router.post("/token", AuthenticationController.refreshToken)

router.delete("/logout", AuthenticationController.logout)

module.exports = router