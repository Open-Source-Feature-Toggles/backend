const Project = require('../../models/api/project')
const Feature = require('../../models/api/feature')
const Variable = require('../../models/api/variable')
const { 
    projectQuery, 
    queryProjectByProductionKey
} = require('../../helpers/common-queries/project-queries')






async function load_entire_project (req, res) {
    try {
        let apiKey = req.headers.authorization
        let project = await queryProjectByProductionKey(apiKey)
        console.log(project)
        


    } catch (error) {
        res.status(500)
        console.error(error)
    }
}

module.exports = {
    load_entire_project, 
}


