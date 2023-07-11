const { setCache } = require('./Redis-Helpers')
const { projectQuery } = require('../../helpers/common-queries/project-queries')
const { 
    QueryProductionFeatures, 
    QueryDevelopmentFeatures, 
} = require('../../helpers/common-queries/feature-queries')
const {
    QueryVariablesById, 
} = require('../../helpers/common-queries/variable-queries')


function extractVariables (features) {
    return features.map( (feature, _) => {
        return feature.variables
    }).flat()
}

function buildPayload (variables, status) {
    let payload = {
        'features' : {}, 
        'last_updated' : Date.now(), 
    }
    variables.forEach( variable => {
        if (payload['features'][variable.parentFeatureName]) {
            payload['features'][variable.parentFeatureName].push({ [variable.name]: variable[status] });
        } else {
            payload['features'][variable.parentFeatureName] = [{ [variable.name]: variable[status] }];
        }
    })
    return payload
}


async function RebuildDevCache (req, res) {
    try{
        debugger
        let { projectName } = req.body
        let user = req.user
        let project = await projectQuery(projectName, user)
        let features = await QueryDevelopmentFeatures(project.developmentApiKey)
        let variables = extractVariables(features)
        variables = await QueryVariablesById(variables)
        let payload = buildPayload(variables, 'developmentEnabled')
        await setCache(project.developmentApiKey, payload)
        console.log('Successfully Rebuilt Dev Cache')
    } catch (error) {
        console.error(error)
    }
}

async function RebuildProdCache (req, res) {
    try {
        debugger
        let { projectName } = req.body
        let user = req.user
        let project = await projectQuery(projectName, user)
        let features = await QueryProductionFeatures(project.productionApiKey)
        let variables = extractVariables(features)
        variables = await QueryVariablesById(variables)
        let payload = buildPayload(variables, 'productionEnabled')
        await setCache(project.productionApiKey, payload)
        console.log('Successfully Rebuilt Prod Cache')
    } catch (error) {
        console.error(error)
    }
}


// async function RebuildBothCaches (req, res) {
//     try {
//         let { projectName } = req.body
//         let user = req.user
//         let project = await projectQuery(projectName, user) 
//         console.log('Successfully Destroyed Prod and Dev Cache')
//     } catch (error) {
//         console.error(error)
//     }
// }





module.exports = {
    RebuildDevCache, 
    RebuildProdCache, 
}