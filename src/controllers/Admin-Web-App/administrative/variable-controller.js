const Variable = require('../../../models/api/variable')
const { 
    ResourceNotFoundError, 
    NameAlreadyExistsError, 
} = require('../../../helpers/common-error-messages')
const { 
    MakeNewVariableValidation, 
    DeleteVariableValidation, 
    UpdateStatusValidation, 
} = require('../../../validations/variable-validators')
const { 
    findVariableParentQuery,  
    findVariableQuery, 
} = require('../../../helpers/common-queries/variable-queries')


async function MakeNewVariable (req, res, next) {
    try {
        let {
            name, 
            active, 
            parentFeature, 
            projectName, 
        } = req.body
        let [ findParentFeature, checkIfVariableExists ] = await Promise.all([
            findVariableParentQuery(parentFeature, req.user, projectName),
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
            parentProjectName : findParentFeature.parentProjectName, 
        })
        findParentFeature.variables.push(newVariable._id)
        await Promise.all([
            newVariable.save(), 
            findParentFeature.save()
        ])             
        res.sendStatus(200)
        return next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


async function DeleteVariable (req, res, next) {
    try {
        let {
            name, 
            parentFeature, 
            projectName, 
        } = req.body
        let [ findParentFeature, checkIfVariableExists ] = await Promise.all([
            findVariableParentQuery(parentFeature, req.user, projectName),
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
        return next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


async function UpdateProductionStatus (req, res, next) {
    try {
        let {
            name, 
            parentFeature, 
        } = req.body
        let getVariable = await findVariableQuery(name, req.user, parentFeature)
        if (!getVariable) {
            return ResourceNotFoundError(res, "Variable")
        }
        getVariable.productionEnabled = !getVariable.productionEnabled
        await getVariable.save()
        res.status(200).json({ productionEnabled : getVariable.productionEnabled })
        return next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


async function UpdateDevelopmentStatus ( req, res, next ) {
    try {
        let {
            name, 
            parentFeature, 
        } = req.body
        let getVariable = await findVariableQuery(name, req.user, parentFeature)
        if (!getVariable) {
            return ResourceNotFoundError(res, "Variable")
        }
        getVariable.developmentEnabled = !getVariable.developmentEnabled
        await getVariable.save()
        res.status(200).json({ developmentEnabled : getVariable.developmentEnabled })
        return next()
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

exports.POST_update_production_status = [
    UpdateStatusValidation, 
    UpdateProductionStatus, 
]

exports.POST_update_development_status = [
    UpdateStatusValidation, 
    UpdateDevelopmentStatus,
]