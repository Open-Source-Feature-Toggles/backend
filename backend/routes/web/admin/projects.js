const express = require('express')
const router = express.Router() 
const { POST_make_new_project, DELETE_delete_project } = require('../../../controllers/web/admin/project-controller')
const ProtectAuthRoutes = require('../../../middlewares/auth')

router.post("/make-new-project", ProtectAuthRoutes, POST_make_new_project)

router.delete("/delete-project", ProtectAuthRoutes, DELETE_delete_project)


module.exports = router