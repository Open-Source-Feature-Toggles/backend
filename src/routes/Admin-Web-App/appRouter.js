const express = require('express')
const router = express.Router()
const getUserProjects = require('../../controllers/Admin-Web-App/appQueries/projects')
const { ProtectAuthRoutes } = require('../../middlewares/auth')

router.get('/projects/:user', getUserProjects)


module.exports = router 