const { queryAllUserProjects } = require('../../../helpers/common-queries/project-queries')

function formatApiKeyData (projects) {
    let cleanedData = {}
    cleanedData['numProjects'] = projects.length
    cleanedData['names'] = []
    for (let project of projects){
        let {
            name, 
            developmentApiKey, 
            productionApiKey, 
        } = project
        let newPayload = {
            name, 
            developmentApiKey, 
            productionApiKey
        }
        cleanedData[name] = newPayload
        cleanedData['names'].push(name)
    }
    return cleanedData
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

module.exports = {
    getApiKeys, 
}