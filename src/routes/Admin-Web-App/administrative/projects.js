const express = require('express')
const router = express.Router() 
const { ProtectAuthRoutes }  = require('../../../middlewares/auth')
const { DestroyCachedResults } = require('../../../helpers/caching/Cache-Handlers')
const { 
    POST_make_new_project, 
    DELETE_delete_project 
} = require('../../../controllers/Admin-Web-App/administrative/project-controller')

router.post("/make-new-project", ProtectAuthRoutes, POST_make_new_project)

router.delete("/delete-project", ProtectAuthRoutes, DELETE_delete_project, DestroyCachedResults)


module.exports = router