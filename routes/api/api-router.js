const express = require('express')
const router = express.Router() 
const { load_entire_project } = require('../../controllers/api/first-controller')

router.get("/everything", load_entire_project)


module.exports = router 