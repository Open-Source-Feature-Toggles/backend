const Project = require('../../models/api/project')
const Feature = require('../../models/api/feature')
const Variable = require('../../models/api/variable')
const { validationResult, body } = require('express-validator')

exports.POST_make_new_project = [
    body("name").trim().notEmpty().escape(), 
    body("username").trim().notEmpty().escape(), 
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() })
            }
            let { name, username } = req.body
            let projectExists = await Project.findOne({ 
                $and : [
                    { name }, 
                    { owner : username }, 
                ]    
            }).exec()
            if (projectExists){
                return res.status(409).json({ errors: "project-name-exists" })
            }
            let newProject = new Project({
                name,  
                features: [],
                owner: username, 
                created: new Date(), 
            })
            await newProject.save()
            res.sendStatus(200)
        } catch (error){
            console.error(error)
            res.sendStatus(500)
        }
    }
]

exports.POST_delete_project = [
    body("projectName").trim().notEmpty().escape(), 
    body("username").trim().notEmpty().escape(), 
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors : errors.array() })
            }
            let { projectName, username } = req.body
            let project = await Project.findOne({ 
                $and : [
                    { name : projectName }, 
                    { owner : username }, 
                ]
            }).exec()
            if (!project) { 
                return res.status(400).json({ errors : "no-project-found" })    
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
    }
]