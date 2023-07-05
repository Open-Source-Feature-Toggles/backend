const Project = require('../../models/api/project')

function projectQuery (projectName, username) {
    return Project.findOne({
        $and : [
            { name : projectName }, 
            { owner : username }, 
        ]
    })
}

async function queryProjectByProductionKey (apiKey) {
    let productionKeyQuery = Project.findOne({
        productionApiKey : apiKey
    })
    let developmentKeyQuery = Project.findOne({
        developmentApiKey : apiKey, 
    })
    let [ productionProject, developmentProject ] = await Promise.all([
        productionKeyQuery, 
        developmentKeyQuery, 
    ])
    console.log(productionProject)
    console.log(developmentProject)
    if (productionProject) {
        return { "one" : productionProject }
    }
    else {
        return { "two" : developmentProject }
    }
}




module.exports = { 
    projectQuery,  
    queryProjectByProductionKey
} 