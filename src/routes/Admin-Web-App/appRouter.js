const express = require('express')
const router = express.Router()
const { ProtectAuthRoutes } = require('../../middlewares/auth')
const { 
    getUserProjects, 
    getVariables,
    getApiKeys, 
    getHomePageData,
} = require('../../controllers/Admin-Web-App/appQueries/projects')
const {
    getUserFeatures,
    GetFeaturesByProjectName
} = require('../../controllers/Admin-Web-App/appQueries/features')



router.get('/projects', ProtectAuthRoutes, getUserProjects)

router.get('/features', ProtectAuthRoutes, getUserFeatures)

router.get('/variables', ProtectAuthRoutes, getVariables)

router.get('/api-keys', ProtectAuthRoutes, getApiKeys)

router.get('/home', ProtectAuthRoutes, getHomePageData)

router.get('/features-dropdown', ProtectAuthRoutes, GetFeaturesByProjectName)

module.exports = router 