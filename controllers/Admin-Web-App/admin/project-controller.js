const Project = require('../../../models/api/project')
const Feature = require('../../../models/api/feature')
const Variable = require('../../../models/api/variable')
const { ResourceNotFoundError, NameAlreadyExistsError } = require('../../../helpers/common-error-messages')
const { projectValidation } = require('../../../middlewares/form-validation/project-validaters')
const { generateApiKeys } = require('../../../helpers/Api-Key-Helpers')

async function MakeNewProject (req, res) {
    try {
        let { projectName } = req.body
        let projectExists = await Project.findOne({ 
            $and : [
                { projectName }, 
                { owner : req.user }, 
            ]    
        }).exec()
        if (projectExists){
            return NameAlreadyExistsError(res, "Project")
        }
        let [ productionApiKey, developmentApiKey ] = await generateApiKeys()
        let newProject = new Project({
            name : projectName,  
            features: [],
            owner: req.user, 
            created: new Date(), 
            productionApiKey, 
            developmentApiKey, 
        })
        await newProject.save()
        res.sendStatus(200)
    } catch (error){
        console.error(error)
        res.sendStatus(500)
    }
}


async function DeleteProject (req, res) {
    try {
        try {
            let { projectName } = req.body
            let project = await Project.findOne({ 
                $and : [
                    { name : projectName }, 
                    { owner : req.user }, 
                ]
            }).exec()
            if (!project) { 
                return ResourceNotFoundError(res, "Project")  
            }
            await Promise.all([
                Variable.deleteMany({ parentFeatureID : { $in : project.features }}),
                Feature.deleteMany({ parentProjectID : project._id }),
                Project.findByIdAndDelete(project._id),
            ])
            res.sendStatus(200)
        } catch (error) {
            res.sendStatus(500)
            console.error(error)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


exports.POST_make_new_project = [
    projectValidation, 
    MakeNewProject
] 


exports.DELETE_delete_project = [
    projectValidation, 
    DeleteProject, 
]