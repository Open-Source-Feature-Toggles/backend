const {
    projectQuery, 
    queryAllUserProjects 
} = require('../../../helpers/common-queries/project-queries')
const { 
    QueryFeaturesByProject, 
    QueryFeaturesByUser 
} = require('../../../helpers/common-queries/feature-queries')
const { 
    QueryVariablesByProject, 
    QueryVariablesByUser, 
    QueryMostRecentlyUpdatedVariable, 
} = require('../../../helpers/common-queries/variable-queries')
const removeSensitiveProjectData = require('../../../helpers/data-cleaners-react-app/projects')
const { 
    removeSensitiveFeatureData, 
    returnFeatureNames,  
} = require('../../../helpers/data-cleaners-react-app/features')
const removeSensitiveVariableData = require('../../../helpers/data-cleaners-react-app/variables')
const cleanHomePageData = require('../../../helpers/data-cleaners-react-app/home')
const formatApiKeyData = require('../../../helpers/data-cleaners-react-app/apiKeys')

async function getUserProjects (req, res) {
    try {
        let { user } = req
        let [
            userProjects, 
            userFeatures, 
            userVariables
        ] = await Promise.all([
            queryAllUserProjects(user), 
            QueryFeaturesByUser(user), 
            QueryVariablesByUser(user),  
        ]) 
        let cleanData = removeSensitiveProjectData(userProjects, userFeatures, userVariables)
        return res.json(cleanData)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
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

async function getVariables (req, res) {
    try {
        let { user } = req 
        let userVariables = await QueryVariablesByUser(user)
        let cleanedData = removeSensitiveVariableData(userVariables)
        res.json(cleanedData)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
} 

async function getApiKeys (req, res) {
    try {
        let { user } = req
        let userProjects = await queryAllUserProjects(user)
        let cleanedData = formatApiKeyData(userProjects)
        res.json(cleanedData)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function getHomePageData (req, res) {
    try {
        let { user } = req
        let projectName = req.query.project_name
        if (!projectName){ 
            // do something meaningful here, like query last updated variable
            // by the user and then use that as the default landing page
            // could also grab the feature with the most recent update and then use 
            // whichever one is newest 
            projectName = (await QueryMostRecentlyUpdatedVariable(user)).parentProjectName
        }
        let [ 
            features,   
            variables
        ] = await Promise.all([
            QueryFeaturesByProject(projectName, user), 
            QueryVariablesByProject(user, projectName), 
        ])        
        let cleanedData = cleanHomePageData(projectName, features, variables)
        res.json(cleanedData)
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
    getUserProjects, 
    getUserFeatures, 
    getVariables, 
    getApiKeys, 
    getHomePageData, 
    GetFeaturesByProjectName,
} 