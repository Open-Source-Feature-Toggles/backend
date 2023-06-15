const Project = require('../../models/api/project')
const { validationResult, body } = require('express-validator')

exports.POST_make_new_project = [
    body("name").trim().notEmpty().escape(), 
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() })
            }
            let { name } = req.body
            let projectExists = await Project.findOne({ name })
            if (!projectExists){
                return res.status(409).json({ error: "project-name-exists" })
            }
            let newProject = new Project({
                name,  
                features: [],
                owner: null, 
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