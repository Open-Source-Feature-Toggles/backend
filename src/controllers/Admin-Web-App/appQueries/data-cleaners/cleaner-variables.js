const prettyFormatDate = require('../../../../helpers/app-queries-helpers/prettyFormaters')

function removeSensitiveVariableData (variables) {
    let cleanedData = {}
    cleanedData['numVariables'] = variables.length
    cleanedData['names'] = []
    cleanedData['allVariableNames'] = []
    for (let variable of variables) {
        let {
            name, 
            parentFeatureName, 
            developmentEnabled, 
            productionEnabled, 
            parentProjectName, 
            updatedAt 
        } = variable
        let uniqueEntryName = `${name}_${parentFeatureName}` 
        cleanedData[uniqueEntryName] = {
            name, 
            parentFeatureName, 
            developmentEnabled, 
            productionEnabled, 
            parentProjectName, 
            updatedAt : prettyFormatDate(updatedAt) 
        }
        cleanedData['names'].push(uniqueEntryName)
        cleanedData['allVariableNames'].push(name)
    }
    return cleanedData
}

module.exports = {
    removeSensitiveVariableData
}