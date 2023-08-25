
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

module.exports = returnMostRecentlyUpdated