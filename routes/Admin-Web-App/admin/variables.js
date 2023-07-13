const express = require('express')
const router = express.Router() 
const { ProtectAuthRoutes }  = require('../../../middlewares/auth')
const { 
    POST_make_new_variable, 
    DELETE_delete_variable,  
    POST_update_production_status, 
    POST_update_development_status, 
} = require('../../../controllers/Admin-Web-App/admin/variable-controller')
const {
    RebuildDevCache, 
    RebuildProdCache,     
    RebuildBothCaches, 
} = require('../../../helpers/caching/Cache-Handlers')



router.post("/make-new-variable", ProtectAuthRoutes, POST_make_new_variable, RebuildBothCaches)

router.post("/update-production-status", ProtectAuthRoutes, POST_update_production_status, RebuildProdCache)

router.post("/update-development-status", ProtectAuthRoutes, POST_update_development_status, RebuildDevCache)

router.delete("/delete-variable", ProtectAuthRoutes, DELETE_delete_variable, RebuildBothCaches)

module.exports = router