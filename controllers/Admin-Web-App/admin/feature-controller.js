const Feature = require('../../../models/api/feature')
const Variable = require("../../../models/api/variable")
const mongoose = require('mongoose')
const { ResourceNotFoundError, NameAlreadyExistsError } = require('../../../helpers/common-error-messages')
const { 
    Name_ProjectName_Validation, 
    Make_New_Feature_Validation
} = require('../../../middlewares/form-validation/feature-validators')
const { FeatureExistsQuery } = require('../../../helpers/common-queries/feature-queries')
const { projectQuery } = require('../../../helpers/common-queries/project-queries')


async function ChangeProductionStatus (req, res, next) {
    try {   
        let { 
            featureName,  
            projectName
        } = req.body
        let feature = await FeatureExistsQuery(featureName, req.user, projectName).exec()
        if (!feature){
            return ResourceNotFoundError(res, "Feature")
        }
        feature.productionEnabled = !feature.productionEnabled
        await feature.save()
        res.status(200).json({ production_status : feature.productionEnabled })
        return next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function ChangeDevelopmentStatus (req, res, next) {
    try {   
        let { 
            featureName, 
            projectName
        } = req.body
        let feature = await FeatureExistsQuery(featureName, req.user, projectName).exec()
        if (!feature){
            return ResourceNotFoundError(res, "Feature")
        }
        feature.developmentEnabled = !feature.developmentEnabled
        await feature.save()
        res.status(200).json({ production_status : feature.developmentEnabled })
        return next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function DeleteFeature (req, res) {
    try {
        let { 
            featureName, 
            projectName, 
        } = req.body
        let [project, feature] = await Promise.all([
            projectQuery(projectName, req.user), 
            FeatureExistsQuery(featureName, req.user, projectName), 
        ])
        if (!project || !feature ) { 
            return ResourceNotFoundError(res, "Project and or Feature")
        }
        project.features = project.features.filter(
            projectFeature => !projectFeature._id.equals(feature._id)
        )
        await Promise.all([
            project.save(),
            Variable.deleteMany({ _id: { $in: feature.variables } }), 
            Feature.findByIdAndDelete(feature._id), 
        ])
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function MakeNewFeature (req, res) {
    try {
        let { 
            featureName, 
            description, 
            initialVariableKey,
            projectName, 
            featureVariableName, 
        } = req.body
        let [ checkIfFeatureExists, getProject ] = await Promise.all([
            FeatureExistsQuery(featureName, req.user, projectName), 
            projectQuery(projectName, req.user),
        ])
        if (checkIfFeatureExists) {
            return NameAlreadyExistsError(res, "Feature name")
        }
        if (!getProject) { 
            return ResourceNotFoundError(res, "Project") 
        }
        let newVariable = new Variable({
            name : initialVariableKey, 
            active: false, 
            owner : req.user, 
            created : new Date(), 
        })
        let newFeature = new Feature({
            name: featureName, 
            variableName : featureVariableName, 
            variables : [ newVariable._id ], 
            description, 
            developmentEnabled : false, 
            productionEnabled : false, 
            parentProjectName : getProject.name,
            parentProjectID : getProject._id, 
            productionApiKey : getProject.productionApiKey, 
            developmentApiKey : getProject.developmentApiKey, 
            owner : req.user, 
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


exports.POST_change_production_status = [
    Name_ProjectName_Validation, 
    ChangeProductionStatus, 
]

exports.POST_change_development_status = [
    Name_ProjectName_Validation, 
    ChangeDevelopmentStatus, 
]

exports.POST_delete_feature = [
    Name_ProjectName_Validation, 
    DeleteFeature
]

exports.POST_make_new_feature = [
    Make_New_Feature_Validation, 
    MakeNewFeature
]