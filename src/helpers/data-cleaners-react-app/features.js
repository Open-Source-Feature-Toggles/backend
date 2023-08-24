const prettyFormatDate = require('./prettyFormaters')

function removeSensitiveFeatureData (features) {
    let cleaned_data = {}
    cleaned_data['numFeatures'] = features.length
    cleaned_data['names'] = []
    cleaned_data['allFeatureNames'] = []
    for (let feature of features){
        let {
            name, 
            variables, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName, 
            createdAt, 
        } = feature
        let uniqueEntryName = `${name}_${parentProjectName}`
        cleaned_data[uniqueEntryName] = {
            name, 
            variables : variables.length, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName,
            createdAt : prettyFormatDate(createdAt), 
        }
        cleaned_data['names'].push(uniqueEntryName)
        cleaned_data['allFeatureNames'].push(name)
    }  
    return cleaned_data 
}

function returnFeatureNames (features) {
    let names = []
    for (let feature of features) {
        names.push(feature.name)
    }
    return { names }
}

module.exports = { 
    removeSensitiveFeatureData, 
    returnFeatureNames, 
}