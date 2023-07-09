const express = require('express')
const router = express.Router() 
const { load_entire_project } = require('../../controllers/api/first-controller')
const { FindCachedPayload } = require('../../middlewares/cache')

router.get("/everything", FindCachedPayload, load_entire_project)

module.exports = router 