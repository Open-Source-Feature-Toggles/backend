const express = require('express')
const router = express.Router() 
const projects_controller = require('../../../controllers/web/admin/project-controller')
const ProtectAuthRoutes = require('../../../middlewares/auth')

router.post("/make-new-project", ProtectAuthRoutes, projects_controller.POST_make_new_project)

router.delete("/delete-a-project", ProtectAuthRoutes, projects_controller.POST_delete_project)


module.exports = router