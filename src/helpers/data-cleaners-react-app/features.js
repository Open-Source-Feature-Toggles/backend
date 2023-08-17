/* 
Needed data

name
number of variables
parentProjectName
developmentEnabled
productionEnabled
createdAt

*/


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

        cleaned_data[name] = {
            name, 
            variables : variables.length, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName,
            createdAt,  
        }
        cleaned_data['names'].push(name)
    }  
    return cleaned_data 
}

module.exports = removeSensitiveFeatureData