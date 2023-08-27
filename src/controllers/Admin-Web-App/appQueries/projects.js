const {
    projectQuery, 
    queryAllUserProjects, 
    queryMostRecentlyUpdatedProject, 
} = require('../../../helpers/common-queries/project-queries')
const { 
    QueryFeaturesByProject, 
    QueryFeaturesByUser, 
    QueryMostRecentlyUpdatedFeature, 
} = require('../../../helpers/common-queries/feature-queries')
const { 
    QueryVariablesByProject, 
    QueryVariablesByUser, 
    QueryMostRecentlyUpdatedVariable, 
} = require('../../../helpers/common-queries/variable-queries')
const removeSensitiveProjectData = require('../../../helpers/data-cleaners-react-app/projects')
const removeSensitiveVariableData = require('../../../helpers/data-cleaners-react-app/variables')
const cleanHomePageData = require('../../../helpers/data-cleaners-react-app/home')
const formatApiKeyData = require('../../../helpers/data-cleaners-react-app/apiKeys')
const returnMostRecentlyUpdated = require('../../../helpers/data-cleaners-react-app/compareDates')

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
            let [
                project, 
                feature, 
                variable
            ] = await Promise.all([
                queryMostRecentlyUpdatedProject(user), 
                QueryMostRecentlyUpdatedFeature(user), 
                QueryMostRecentlyUpdatedVariable(user), 
            ])
            projectName = returnMostRecentlyUpdated(project, feature, variable)
            if (!projectName){
                return res.status(200).json({ noProjects : true })
            }
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

module.exports = { 
    getUserProjects, 
    getVariables, 
    getApiKeys, 
    getHomePageData, 
} 