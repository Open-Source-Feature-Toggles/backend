const express = require('express')
const router = express.Router()
const getUserProjects = require('../../controllers/Admin-Web-App/appQueries/projects')

router.get('/projects/:user', getUserProjects)


module.exports = router 