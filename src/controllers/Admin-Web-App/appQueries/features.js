const { QueryFeaturesByUser } = require('../../../helpers/common-queries/feature-queries')
const { QueryFeaturesByProject } = require('../../../helpers/common-queries/feature-queries')
const prettyFormatDate = require('../../../helpers/app-queries-helpers/prettyFormaters')

function removeSensitiveFeatureData (features) {
    let cleaned_data = {}
    cleaned_data['numFeatures'] = features.length
    cleaned_data['names'] = []
    cleaned_data['allFeatureNames'] = []
    for (let feature of features){
        let {
            name, 
            variables, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName, 
            createdAt, 
        } = feature
        let uniqueEntryName = `${name}_${parentProjectName}`
        cleaned_data[uniqueEntryName] = {
            name, 
            variables : variables.length, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName,
            createdAt : prettyFormatDate(createdAt), 
        }
        cleaned_data['names'].push(uniqueEntryName)
        cleaned_data['allFeatureNames'].push(name)
    }  
    return cleaned_data 
}

function returnFeatureNames (features) {
    let names = []
    for (let feature of features) {
        names.push(feature.name)
    }
    return { names }
}

async function getUserFeatures (req, res) {
    try {
        let { user } = req
        let userFeatures = await QueryFeaturesByUser(user)
        let cleaned_data = removeSensitiveFeatureData(userFeatures)
        res.json(cleaned_data)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


async function GetFeaturesByProjectName (req, res) {
    try {
        let { user } = req 
        let projectName = req.query.project_name
        let features = await QueryFeaturesByProject(projectName, user)
        let getNames = returnFeatureNames(features)
        res.json(getNames)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


module.exports = {
    getUserFeatures, 
    GetFeaturesByProjectName,
}