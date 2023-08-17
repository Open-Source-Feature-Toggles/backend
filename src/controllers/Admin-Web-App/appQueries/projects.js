const { queryAllUserProjects } = require('../../../helpers/common-queries/project-queries')
const { QueryFeaturesByUser } = require('../../../helpers/common-queries/feature-queries')
const { QueryVariablesByUser } = require('../../../helpers/common-queries/variable-queries')
const removeSensitiveProjectData = require('../../../helpers/data-cleaners-react-app/projects')
const removeSensitiveFeatureData = require('../../../helpers/data-cleaners-react-app/features')

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

module.exports = { 
    getUserProjects, 
    getUserFeatures 
} 