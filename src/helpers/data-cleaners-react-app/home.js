const prettyFormatDate = require('./prettyFormaters')


function cleanHomePageData (projectName, features, variables) {
    let cleanedData = {}
    cleanedData["projectName"] = projectName
    cleanedData['featureNames'] = []
    cleanedData['features'] = {}
    for (let feature of features){
        let {
            name, 
            description, 
            developmentEnabled, 
            productionEnabled,
            createdAt, 
        } = feature
        let featureEntry = cleanedData["features"][`${feature.name}`] = {
            name, 
            description, 
            developmentEnabled, 
            productionEnabled, 
            createdAt, 
        }
        cleanedData["featureNames"].push(name)
        featureEntry["variables"] = {}
        featureEntry["variableNames"] = []
        for (let variable of variables) {
            if (variable.parentFeatureName === name){
                let {
                    name, 
                    developmentEnabled, 
                    productionEnabled, 
                } = variable
                featureEntry["variables"][name] = {
                    name, 
                    developmentEnabled, 
                    productionEnabled
                }
                featureEntry["variableNames"].push(name)
            }
        }
    }
    return cleanedData
}

module.exports = cleanHomePageData