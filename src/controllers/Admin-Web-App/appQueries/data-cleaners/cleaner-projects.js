function countFeaturesByProject (features) {
    let projectFeatureCount = {}
    for (let feature of features){
        let { 
            parentProjectName, 
            productionEnabled,
            developmentEnabled,   
            variables, 
        } = feature
        if (!projectFeatureCount[parentProjectName]){
            projectFeatureCount[parentProjectName] = {
                productionEnabled : 0, 
                developmentEnabled : 0,  
                variables : 0, 
            }
        }
        let projectEntry = projectFeatureCount[parentProjectName]
        if (projectEntry && productionEnabled){
            projectEntry['productionEnabled'] += 1 
        }
        if (projectEntry && developmentEnabled){
            projectEntry['developmentEnabled'] += 1 
        }
        projectEntry.variables += variables.length
    }
    return projectFeatureCount
}


function removeSensitiveProjectData (projects, features, variables) {
    let new_data = {}
    new_data['names'] = []
    new_data['numProjects'] = projects.length
  
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

module.exports = {
    removeSensitiveProjectData, 
}