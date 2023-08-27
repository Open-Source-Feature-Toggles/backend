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
            parentProjectName, 
            createdAt, 
        } = feature
        let featureEntry = cleanedData["features"][`${feature.name}`] = {
            name, 
            description, 
            developmentEnabled, 
            productionEnabled, 
            parentProjectName, 
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

function returnMostRecentlyUpdated (project, feature, variable) {
    let hold_items = []
    if (project){
        hold_items.push({ 
            document: project, 
            time : new Date(project.createdAt), 
            'project' : true, 
        })
    }
    if (feature){
        hold_items.push({ 
            document: feature, 
            time : new Date(feature.createdAt), 
            'feature' : true, 
        })
    }
    if (variable){
        hold_items.push({ 
            document: variable, 
            time : new Date(variable.createdAt), 
            'variable': true, 
        })
    }
    console.log('hi')
    hold_items.sort( (a, b) => b.time - a.time)
    let mostRecentlyUpdated = hold_items[0]
    if (!mostRecentlyUpdated){
        return null
    }
    else if (mostRecentlyUpdated.project){
        return mostRecentlyUpdated.document.name
    }
    else if (mostRecentlyUpdated.feature || mostRecentlyUpdated.variable){
        return mostRecentlyUpdated.document.parentProjectName
    }
}

module.exports = {
    cleanHomePageData, 
    returnMostRecentlyUpdated, 
}