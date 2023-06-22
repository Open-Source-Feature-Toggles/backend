const express = require('express')
const router = express.Router() 
const feature_controller = require("../../controllers/api/feature-controller")

router.post("/change-production-status", feature_controller.POST_change_production_status)

router.post("/change-development-status", feature_controller.POST_change_development_status)

router.post("/make-new-feature", feature_controller.POST_make_new_feature)

router.delete("/delete-feature", feature_controller.POST_delete_feature)


module.exports = router