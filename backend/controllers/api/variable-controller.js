const Variable = require('../../models/api/variable')
const Feature = require('../../models/api/feature')
const { validationResult, body } = require('express-validator')


function findParentFeatureQuery (name, owner, parentProject) {
    return Feature.findOne({
        $and : [
            { $and : [
                { name }, 
                { owner }
            ]}, 
            { parentProjectName : parentProject }
        ]
    })
} 

function findVariableQuery ( name, owner, parentFeature ) {
    return Variable.findOne({
        $and : [
            { $and : [
                { name }, 
                { parentFeatureName: parentFeature }
            ]}, 
            { owner }
        ]
    })
}


exports.POST_make_new_variable = [
    body("name").trim().notEmpty().escape(), 
    body("active").trim().notEmpty().isBoolean().escape(), 
    body("parentFeature").trim().notEmpty().escape(), 
    body("parentProject").trim().notEmpty().escape(), 
    body("username").trim().notEmpty().escape(), 
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors : errors.array() })
            }
            let {
                name, 
                active, 
                parentFeature, 
                parentProject, 
                username
            } = req.body
            let [ findParentFeature, checkIfVariableExists ] = await Promise.all([
                findParentFeatureQuery(parentFeature, username, parentProject),
                findVariableQuery(name, username, parentFeature)
            ])
            if (!findParentFeature){
                return res.status(404).json({ errors: "could-not-find-parent-feature" })
            }
            if (checkIfVariableExists){
                return res.status(409).json({ errors : "variable-already-exists" })
            }
            let newVariable = new Variable({
                name, 
                active, 
                owner : username, 
                created : new Date(), 
                parentFeatureName : findParentFeature.name,
                parentFeatureID : findParentFeature._id,  
            })
            findParentFeature.variables.push(newVariable._id)
            await Promise.all([
                newVariable.save(), 
                findParentFeature.save()
            ])             
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
]


exports.POST_delete_variable = [
    body("name").trim().notEmpty().escape(), 
    body("parentFeature").trim().notEmpty().escape(), 
    body("parentProject").trim().notEmpty().escape(), 
    body("username").trim().notEmpty().escape(), 
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors : errors.array() })
            }
            let {
                name, 
                parentFeature, 
                parentProject, 
                username
            } = req.body
            let [ findParentFeature, checkIfVariableExists ] = await Promise.all([
                findParentFeatureQuery(parentFeature, username, parentProject),
                findVariableQuery(name, username, parentFeature)
            ])
            if (!findParentFeature){
                return res.status(409).json({ errors: "cant-find-project" })
            } 
            if (!checkIfVariableExists){
                return res.status(409).json({ errors : "variable-dne" })
            }
            findParentFeature.variables = findParentFeature.variables.filter(
                variable => !variable._id.equals(checkIfVariableExists._id)
            )
            await Promise.all([
                findParentFeature.save(), 
                Variable.findByIdAndDelete(checkIfVariableExists._id)
            ])
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
]



exports.POST_update_variable_status = [
    body("name").trim().notEmpty().escape(), 
    body("parentFeature").trim().notEmpty().escape(), 
    body("username").trim().notEmpty().escape(),
    async function (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() })
            }
            let { 
                name, 
                parentFeature, 
                username, 
            } = req.body 
            let getVariable = await findVariableQuery(name, username, parentFeature).exec()
            if (!getVariable){
                res.status(404).json({ errors: "variable-not-found" })
            }
            getVariable.active = !getVariable.active
            await getVariable.save()
            res.status(200).json({ active_status : getVariable.active })
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    } 
]