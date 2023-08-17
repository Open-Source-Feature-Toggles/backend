const express = require('express')
const router = express.Router()
const { 
    getUserProjects, 
    getUserFeatures 
} = require('../../controllers/Admin-Web-App/appQueries/projects')
const { ProtectAuthRoutes } = require('../../middlewares/auth')

router.get('/projects', ProtectAuthRoutes, getUserProjects)

router.get('/features', ProtectAuthRoutes, getUserFeatures)

module.exports = router 