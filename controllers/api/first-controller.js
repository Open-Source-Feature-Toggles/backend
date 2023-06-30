const Project = require('../../models/api/project')
const Feature = require('../../models/api/feature')
const Variable = require('../../models/api/variable')
const projectQuery = require('../../helpers/common-queries/project-queries')






async function load_entire_project (req, res) {
    try {
        let { username, project_name } = req.params
        let project = await projectQuery(project_name, username)
        let features = await Feature.find({ _id : { $in : project.features } })
        let [ variables ] = await Promise.all( features.map( (feature) => {
            return Variable.find({ _id : { $in : feature.variables }})
        }))
        console.log(variables)
        let data = {
            project, 
            features, 
            variables, 
        }
        res.json( data )


    } catch (error) {
        res.status(500)
        console.error(error)
    }
}

module.exports = {
    load_entire_project, 
}


/* 
function projectQuery (projectName, username) {
    return Project.findOne({
        $and : [
            { name : projectName }, 
            { owner : username }, 
        ]
    })
}
*/ 