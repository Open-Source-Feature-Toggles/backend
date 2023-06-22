const Feature = require('../../models/api/feature')
const Variable = require("../../models/api/variable")
const Project = require('../../models/api/project')
const User = require("../../models/auth/user")
const mongoose = require('mongoose')
const { validationResult, body } = require('express-validator')


function projectQuery (projectName, username) {
    return Project.findOne({
        $and : [
            { name : projectName }, 
            { owner : username }, 
        ]
    })
}

function FeatureExistsQuery (name, username, projectName) {
    return Feature.findOne({
        $and : [
            { $and : [
                { name },
                { owner : username }, 
            ]}, 
            { parentProjectName : projectName }
        ]
    })
}


exports.POST_delete_feature = [
    body("featureName").trim().notEmpty().escape(), 
    body("projectName").trim().notEmpty().escape(), 
    body("featureVariableName").trim().notEmpty().escape(), 
    body("username").trim().notEmpty().escape(), 
    async function (req, res) {
        // Use ACID to ensure all data is deleted or none is deleted at all
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            let errors = validationResult(req)
            if (!errors.isEmpty()){
                    return res.status(400).json({ errors : errors.array() })
            } 
            let { 
                featureName, 
                projectName, 
                featureVariableName, 
                username 
            } = req.body
            let [project, feature] = await Promise.all([
                projectQuery(projectName, username), 
                FeatureExistsQuery(featureName, username, projectName), 
            ])
            if (!project || !feature ) { 
                return res.status(400).json({ error : "cant-access-resource" })
            }
            project.features = project.features.filter(
                projectFeature => !projectFeature._id.equals(feature._id)
            )
            await Promise.all([
                project.save(),
                Variable.deleteMany({ _id: { $in: feature.variables } }), 
                Feature.findByIdAndDelete(feature._id), 
            ])
            await session.commitTransaction()
            session.endSession()
            res.sendStatus(200)
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            console.error(error)
            res.sendStatus(500)
        }
    } 
]


exports.POST_make_new_feature = [
    // This still needs to be assigned an owner at creation
    body("name").trim().notEmpty().escape(), 
    body("description").trim().escape(), 
    body("initialVariableKey").trim().notEmpty().escape(), 
    body("parentProject").trim().notEmpty().escape(), 
    body("featureVariableName").trim().notEmpty().escape(),
    body("username").trim().notEmpty().escape(), 
    async function (req, res) {
        try {
            let errors = validationResult(req)
            if (!errors.isEmpty()){ 
                return res.status(400).json({ errors: errors.array() }) 
            }
            let { 
                name, 
                description, 
                initialVariableKey,
                parentProject, 
                featureVariableName, 
                username, 
            } = req.body
            let [ checkIfFeatureExists, getProject ] = await Promise.all([
                FeatureExistsQuery(name, username, parentProject), 
                projectQuery(parentProject, username),
            ])
            if (checkIfFeatureExists) {
                return res.status(409).json({ error : "feature-name-already-exists" })
            }
            if (!getProject) { 
                return res.status(409).json({ error: "project-not-found" }) 
            }
            let newVariable = new Variable({
                name : initialVariableKey, 
                active: false, 
                owner : username, 
                created : new Date(), 
            })
            let newFeature = new Feature({
                name, 
                variableName : featureVariableName, 
                variables : [ newVariable._id ], 
                description, 
                developmentEnabled : false, 
                productionEnabled : false, 
                parentProjectName : getProject.name,
                parentProjectID : getProject._id,
                owner : username, 
                created : new Date(), 
            })
            newVariable.parentFeatureName = newFeature.name
            newVariable.parentFeatureID = newFeature._id
            getProject.features.push(newFeature._id)
            await Promise.all([
                getProject.save(), 
                newVariable.save(), 
                newFeature.save(), 
            ])
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
]
