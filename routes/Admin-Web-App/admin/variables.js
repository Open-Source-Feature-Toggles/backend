const express = require('express')
const router = express.Router() 
const { ProtectAuthRoutes }  = require('../../../middlewares/auth')
const { 
    POST_make_new_variable, 
    POST_update_variable_status, 
    DELETE_delete_variable,  
} = require('../../../controllers/Admin-Web-App/admin/variable-controller')


router.post("/make-new-variable", ProtectAuthRoutes, POST_make_new_variable)

router.post("/update-variable-status", ProtectAuthRoutes, POST_update_variable_status)

router.delete("/delete-variable", ProtectAuthRoutes, DELETE_delete_variable)

module.exports = router