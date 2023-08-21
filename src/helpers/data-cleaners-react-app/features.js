const prettyFormatDate = require('./prettyFormaters')

function removeSensitiveFeatureData (features) {
    let cleaned_data = {}
    cleaned_data['numFeatures'] = features.length
    cleaned_data['names'] = []
    for (let feature of features){
        let {
            name, 
            variables, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName, 
            createdAt, 
        } = feature
        let uniqueEntryName = `${parentProjectName}_${name}`
        cleaned_data[uniqueEntryName] = {
            name, 
            variables : variables.length, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName,
            createdAt : prettyFormatDate(createdAt), 
        }
        cleaned_data['names'].push(uniqueEntryName)
    }  
    return cleaned_data 
}

module.exports = removeSensitiveFeatureData