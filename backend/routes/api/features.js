const express = require('express')
const router = express.Router() 
const feature_controller = require("../../controllers/api/feature-controller")
const ProtectAuthRoutes = require('../../middlewares/auth')

router.post("/change-production-status", ProtectAuthRoutes, feature_controller.POST_change_production_status)

router.post("/change-development-status", ProtectAuthRoutes, feature_controller.POST_change_development_status)

router.post("/make-new-feature", ProtectAuthRoutes, feature_controller.POST_make_new_feature)

router.delete("/delete-feature", ProtectAuthRoutes, feature_controller.POST_delete_feature)


module.exports = router