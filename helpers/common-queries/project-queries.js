const Project = require('../../models/api/project')

function projectQuery (projectName, username) {
    return Project.findOne({
        $and : [
            { name : projectName }, 
            { owner : username }, 
        ]
    })
}

async function queryByApiKey (apiKey) {
    return Project.findOne({
        $or : [
            { productionApiKey : apiKey }, 
            { developmentApiKey : apiKey }, 
        ]
    })
}



module.exports = { 
    projectQuery,  
    queryByApiKey
} 