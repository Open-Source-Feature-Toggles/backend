const express = require('express')
const router = express.Router() 
const second_controller = require('../controllers/second-controller')

router.post('/start-app', second_controller.startup)

router.post("/login", second_controller.login)

router.post("/test", second_controller.no_name, second_controller.test)

router.get("/test-protected-route", second_controller.no_name, second_controller.test)


module.exports = router