const {
    queryMostRecentlyUpdatedProject, 
} = require('../../../helpers/common-queries/project-queries')
const { 
    QueryFeaturesByProject, 
    QueryMostRecentlyUpdatedFeature, 
} = require('../../../helpers/common-queries/feature-queries')
const { 
    QueryVariablesByProject, 
    QueryMostRecentlyUpdatedVariable, 
} = require('../../../helpers/common-queries/variable-queries')

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

async function getHomePageData (req, res) {
    try {
        let { user } = req
        let projectName = req.query.project_name
        if (!projectName){
            /* 

            If the application does not provide a specific project that it would
            like to query, this will go through all user documents (projects, variables, 
            and features) and will select the one that was most recently updated
            */ 
            let [
                project, 
                feature, 
                variable
            ] = await Promise.all([
                queryMostRecentlyUpdatedProject(user), 
                QueryMostRecentlyUpdatedFeature(user), 
                QueryMostRecentlyUpdatedVariable(user), 
            ])
            projectName = returnMostRecentlyUpdated(project, feature, variable)
            if (!projectName){
                return res.status(200).json({ noProjects : true })
            }
        }
        let [ 
            features,   
            variables
        ] = await Promise.all([
            QueryFeaturesByProject(projectName, user), 
            QueryVariablesByProject(user, projectName), 
        ])        
        let cleanedData = cleanHomePageData(projectName, features, variables)
        res.json(cleanedData)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

module.exports = {
    getHomePageData
}