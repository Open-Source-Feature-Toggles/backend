const Variable = require('../../../models/api/variable')
const { 
    ResourceNotFoundError, 
    NameAlreadyExistsError, 
    BadRequest,  
} = require('../../../helpers/common-error-messages')
const { 
    MakeNewVariableValidation, 
    DeleteVariableValidation, 
    UpdateVariableStatusValidation, 
} = require('../../../middlewares/form-validation/variable-validators')
const { 
    findVariableParentQuery,  
    findVariableQuery, 
} = require('../../../helpers/common-queries/variable-queries')


async function MakeNewVariable (req, res) {
    try {
        let {
            name, 
            active, 
            parentFeature, 
            parentProject, 
        } = req.body
        let [ findParentFeature, checkIfVariableExists ] = await Promise.all([
            findVariableParentQuery(parentFeature, req.user, parentProject),
            findVariableQuery(name, req.user, parentFeature)
        ])
        if (!findParentFeature){
            return ResourceNotFoundError(res, "Parent Feature")
        }
        if (checkIfVariableExists){
            return NameAlreadyExistsError(res, "variable name")
        }
        let newVariable = new Variable({
            name, 
            active, 
            owner : req.user, 
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


async function DeleteVariable (req, res) {
    try {
        let {
            name, 
            parentFeature, 
            parentProject, 
        } = req.body
        let [ findParentFeature, checkIfVariableExists ] = await Promise.all([
            findVariableParentQuery(parentFeature, req.user, parentProject),
            findVariableQuery(name, req.user, parentFeature)
        ])
        if (!findParentFeature){
            return ResourceNotFoundError(res, "Parent Feature")
        } 
        if (!checkIfVariableExists){
            return ResourceNotFoundError(res, "Variable")
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


async function UpdateVariableStatus (req, res) {
    try {
        let { 
            name, 
            parentFeature, 
            production, 
            development, 
        } = req.body
        production = production === 'true'
        development = development === 'true'
        if (!production && !development || production && development ) {
            return BadRequest(res)
        } 
        let getVariable = await findVariableQuery(name, req.user, parentFeature).exec()
        if (!getVariable){
            return ResourceNotFoundError(res, "Variable")
        }
        let status 
        if (production){
            getVariable.productionEnabled = !getVariable.productionEnabled
            status = { 'production' : getVariable.productionEnabled } 
        }
        else {
            getVariable.developmentEnabled = !getVariable.developmentEnabled
            status = { 'development' : getVariable.developmentEnabled }
        }
        await getVariable.save()
        res.status(200).json( status )
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


exports.POST_make_new_variable = [
    MakeNewVariableValidation, 
    MakeNewVariable
]

exports.DELETE_delete_variable = [
    DeleteVariableValidation, 
    DeleteVariable, 
]

exports.POST_update_variable_status = [
    UpdateVariableStatusValidation, 
    UpdateVariableStatus, 
]