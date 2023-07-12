const { BadApiKeyError } = require('../../helpers/common-error-messages')
const { 
    setCache, 
    removeKey 
} = require('./Redis-Helpers')
const { 
    projectQuery, 
    queryByApiKey, 
} = require('../../helpers/common-queries/project-queries')
const { 
    QueryProductionFeatures, 
    QueryDevelopmentFeatures, 
} = require('../../helpers/common-queries/feature-queries')
const {
    QueryVariablesById, 
} = require('../../helpers/common-queries/variable-queries')


const DEVELOPMENT_ENABLED = 'developmentEnabled'
const PRODUCTION_ENABLED = 'productionEnabled'

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
        let payload = buildPayload(variables, DEVELOPMENT_ENABLED)
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
        let payload = buildPayload(variables, PRODUCTION_ENABLED)
        await setCache(project.productionApiKey, payload)
        console.log('Successfully Rebuilt Prod Cache')
    } catch (error) {
        console.error(error)
    }
}


async function RebuildBothCaches (req, res) {
    try {
        let { projectName } = req.body
        let user = req.user
        let project = await projectQuery(projectName, user) 
        let [developmentFeatures, productionFeatures] = await Promise.all([
            QueryDevelopmentFeatures(project.developmentApiKey, user), 
            QueryProductionFeatures(project.productionApiKey, user)
        ])
        let developmentVariableIds = extractVariables(developmentFeatures)
        let productionVariableIds = extractVariables(productionFeatures)
        let [getDevelopmentVariables, getProductionVariables] = await Promise.all([
            QueryVariablesById(developmentVariableIds), 
            QueryVariablesById(productionVariableIds), 
        ])
        let developmentPayload = buildPayload(getDevelopmentVariables, DEVELOPMENT_ENABLED)
        let productionPayload = buildPayload(getProductionVariables, PRODUCTION_ENABLED)
        await Promise.all([
            setCache(project.developmentApiKey, developmentPayload), 
            setCache(project.productionApiKey, productionPayload), 
        ])
        console.log('Successfully Rebuilt Prod and Dev Cache')
    } catch (error) {
        console.error(error)
    }
}


async function DestroyCachedResults (req, res) {
    try {
        let { 
            productionApiKey,  
            developmentApiKey, 
        } = req
        await Promise.all([
            removeKey(productionApiKey), 
            removeKey(developmentApiKey),
        ])
        console.log('Successfully Destroyed Prod and Dev Cache')
    } catch (error) {
        console.error(error)
    }
}


async function BuildPayloadOnTheFly (res, apiKey) {
    try {
        let getProject = await queryByApiKey(apiKey)
        if (!getProject){
            return BadApiKeyError(res)
        }
        

    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    RebuildDevCache, 
    RebuildProdCache, 
    RebuildBothCaches, 
    DestroyCachedResults, 
}

/* 
    TODO 

    DRY - Don't repeat yourself... Try to simplify these functions 

    Use flatMAP instead of flat 

*/