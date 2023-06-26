const express = require('express')
const router = express.Router() 
const variable_controller = require('../../controllers/api/variable-controller')
const ProtectAuthRoutes = require('../../middlewares/auth')

router.post("/make-new-variable", ProtectAuthRoutes, variable_controller.POST_make_new_variable)

router.post("/update-variable-status", ProtectAuthRoutes, variable_controller.POST_update_variable_status)

router.delete("/delete-variable", ProtectAuthRoutes, variable_controller.POST_delete_variable)

module.exports = router