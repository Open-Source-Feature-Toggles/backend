const express = require('express')
const router = express.Router() 
const index_controller = require("../controllers/index-controller")

router.post("/make-new-feature", index_controller.POST_make_new_feature)


module.exports = router