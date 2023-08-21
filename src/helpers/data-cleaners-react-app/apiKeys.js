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


module.exports = formatApiKeyData