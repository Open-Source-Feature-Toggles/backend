const express = require('express')
const router = express.Router() 
const { ProtectAuthRoutes }  = require('../../../middlewares/auth')
const { 
    POST_make_new_variable, 
    DELETE_delete_variable,  
    POST_update_production_status, 
    POST_update_development_status, 
} = require('../../../controllers/Admin-Web-App/admin/variable-controller')


router.post("/make-new-variable", ProtectAuthRoutes, POST_make_new_variable)

router.post("/update-production-status", ProtectAuthRoutes, POST_update_production_status)

router.post("/update-development-status", ProtectAuthRoutes, POST_update_development_status)

router.delete("/delete-variable", ProtectAuthRoutes, DELETE_delete_variable)

module.exports = router