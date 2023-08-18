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

        let date = new Date(createdAt)
        date = `${date.getMonth() + 1}/${date.getDay()}/${date.getFullYear()}`

        cleaned_data[name] = {
            name, 
            variables : variables.length, 
            productionEnabled, 
            developmentEnabled, 
            parentProjectName,
            createdAt : date,  
        }
        cleaned_data['names'].push(name)
    }  
    return cleaned_data 
}

module.exports = removeSensitiveFeatureData