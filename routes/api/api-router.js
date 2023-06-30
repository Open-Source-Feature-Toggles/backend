const express = require('express')
const router = express.Router() 
const { load_entire_project } = require('../../controllers/api/first-controller')

router.get("/everything/:username/:project_name", load_entire_project)




module.exports = router 