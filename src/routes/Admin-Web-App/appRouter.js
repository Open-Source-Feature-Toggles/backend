const express = require('express')
const router = express.Router()
const { ProtectAuthRoutes } = require('../../middlewares/auth')
const { 
    getUserProjects, 
    getHomePageData,
} = require('../../controllers/Admin-Web-App/appQueries/projects')
const {
    getUserFeatures,
    GetFeaturesByProjectName
} = require('../../controllers/Admin-Web-App/appQueries/features')
const { getVariables } = require('../../controllers/Admin-Web-App/appQueries/variables')
const { getApiKeys } = require('../../controllers/Admin-Web-App/appQueries/api-keys')


router.get('/projects', ProtectAuthRoutes, getUserProjects)

router.get('/features', ProtectAuthRoutes, getUserFeatures)

router.get('/variables', ProtectAuthRoutes, getVariables)

router.get('/api-keys', ProtectAuthRoutes, getApiKeys)

router.get('/home', ProtectAuthRoutes, getHomePageData)

router.get('/features-dropdown', ProtectAuthRoutes, GetFeaturesByProjectName)

module.exports = router 