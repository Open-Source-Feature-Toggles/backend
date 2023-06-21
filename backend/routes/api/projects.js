const express = require('express')
const router = express.Router() 
const projects_controller = require('../../controllers/api/project-controller')


router.post("/make-new-project", projects_controller.POST_make_new_project)

router.post("/delete-a-project", projects_controller.POST_delete_project)


module.exports = router