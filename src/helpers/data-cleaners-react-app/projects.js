function countFeaturesByProject (features) {
    let projectFeatureCount = {}
    for (let feature of features){
        let { 
            parentProjectName, 
            productionEnabled,
            developmentEnabled,   
        } = feature
        if (!projectFeatureCount[parentProjectName]){
            projectFeatureCount[parentProjectName] = {
                productionEnabled : 0, 
                developmentEnabled : 0,  
            }
        }
        if (projectFeatureCount[parentProjectName] && productionEnabled){
            projectFeatureCount[parentProjectName]['productionEnabled'] += 1 
        }
        if (projectFeatureCount[parentProjectName] && developmentEnabled){
            projectFeatureCount[parentProjectName]['developmentEnabled'] += 1 
        }
    }
    return projectFeatureCount
}


function removeSensitiveProjectData (projects, features, variables) {
    let new_data = {}
    new_data['names'] = []
    new_data['numProjects'] = projects.length
    new_data['numFeatures'] = features.length
    new_data['numVariables'] = variables.length
  
    for (let project of projects){
        let {
            name, 
            features, 
            updatedAt, 
        } = project
        let newPayload = {
            name, 
            features : features.length, 
            updatedAt
        }
        new_data[name] = newPayload
        new_data['names'].push(name)
    }
    let featureCount = countFeaturesByProject(features)
    
    Object.keys(featureCount).forEach( key => new_data[key] = {...new_data[key], ...featureCount[key]})

    return new_data
}


module.exports = removeSensitiveProjectData