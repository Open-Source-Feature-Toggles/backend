const Feature = require('../../models/api/feature')
const Variable = require("../../models/api/variable")
const Project = require('../../models/api/project')
const User = require("../../models/auth/user")
const { validationResult, body } = require('express-validator')




exports.POST_make_new_feature = [
    body("name").trim().notEmpty().escape(), 
    body("description").trim().escape(), 
    body("initialVariableKey").trim().notEmpty().escape(), 
    body("parentProject").trim().notEmpty().escape(), 
    body("featureVariableName").trim().notEmpty().escape(),
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){ 
                return res.status(400).json({ errors: errors.array() }) 
            }
            let { 
                name, 
                description, 
                initialVariableKey,
                parentProject, 
                featureVariableName, 
            } = req.body
            let getProject = Project.findOne({ name : parentProject })
            if (!getProject) { 
                res.status(409).json({ error: "project-not-found" }) 
            }
            let newVariable = new Variable({
                name : initialVariableKey, 
                active: false, 
            })
            let newFeature = new Feature({
                name, 
                variableName : featureVariableName, 
                variables : [ newVariable._id ], 
                description, 
                developmentEnabled : false, 
                productionEnabled : false, 
                parentProject : getProject._id,
                owner : null, 
                created : new Date(), 
            })
            newVariable.parentFeature = newFeature._id
            await newVariable.save()
            await newFeature.save()
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
]
