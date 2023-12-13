const { projectQuery } = require('../../helpers/common-queries/project-queries')

function extractVariables (features) {
    return features.flatMap( feature => { return feature.variables })
}

function buildPayload (variables, status, projectName) {
    let payload = {
        'features' : {}, 
        'last_updated' : Date.now(), 
        'name' : projectName, 
    }
    variables.forEach( variable => {
        let { parentFeatureName, name } = variable
        if (!payload.features[parentFeatureName]) {
            payload.features[parentFeatureName] = []
        }
        payload.features[parentFeatureName].push({ [name]: variable[status] })
    })
    return payload
}

async function GetProject (req, passedProject=null) {
    try {
        let project, user = req.user 
        if (passedProject){
            project = passedProject
        }
        else {
            let { projectName } = req.body
            project = await projectQuery( projectName, user)
            if (!projectName) {
                throw new Error('Bad Project Name Supplied')
            }
        }
        return project
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    extractVariables, 
    buildPayload, 
    GetProject
}