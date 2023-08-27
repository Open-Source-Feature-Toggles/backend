
const { QueryVariablesByUser } = require('../../../helpers/common-queries/variable-queries')
const prettyFormatDate = require('../../../helpers/data-cleaners-react-app/prettyFormaters')

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


module.exports = {
    getVariables, 
}