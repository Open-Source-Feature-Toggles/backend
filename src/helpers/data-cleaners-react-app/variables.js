const prettyFormatDate = require('./prettyFormaters')

function removeSensitiveVariableData (variables) {
    let cleanedData = {}
    cleanedData['numVariables'] = variables.length
    cleanedData['names'] = []
    for (let variable of variables) {
        let {
            name, 
            parentFeatureName, 
            developmentEnabled, 
            productionEnabled, 
            updatedAt 
        } = variable
        let uniqueEntryName = `${parentFeatureName}_${name}` 
        cleanedData[uniqueEntryName] = {
            name, 
            parentFeatureName, 
            developmentEnabled, 
            productionEnabled, 
            updatedAt : prettyFormatDate(updatedAt) 
        }
        cleanedData['names'].push(uniqueEntryName)
    }
    return cleanedData
}

module.exports = removeSensitiveVariableData