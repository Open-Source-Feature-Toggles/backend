const express = require('express')
const router = express.Router() 
const feature_controller = require("../controllers/feature-controller")

router.post("/make-new-feature", feature_controller.POST_make_new_feature)


module.exports = router