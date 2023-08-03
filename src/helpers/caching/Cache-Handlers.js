const { BadApiKeyError } = require('../../helpers/common-error-messages')
const { QueryVariablesById } = require('../../helpers/common-queries/variable-queries')
const { 
    setCache, 
    removeKey 
} = require('./Redis-Helpers')
const { 
    queryByApiKey, 
} = require('../../helpers/common-queries/project-queries')
const { 
    QueryProductionFeatures, 
    QueryDevelopmentFeatures, 
} = require('../../helpers/common-queries/feature-queries')
const {
    extractVariables, 
    buildPayload,
    GetProject, 
} = require('../../helpers/caching/Cache-Helpers')
const {
    isProductionKey, 
    isDevelopmentKey
} = require('../../helpers/Api-Key-Helpers')

const DEVELOPMENT_ENABLED = 'developmentEnabled'
const PRODUCTION_ENABLED = 'productionEnabled'
const DEVELOPMENT_API_KEY = 'developmentApiKey'
const PRODUCTION_API_KEY = 'productionApiKey'
const DEV = 'Dev'
const PROD = 'Prod'


async function RebuildDevCache (req, res, next, project=null) {
    await RebuildCache(req, QueryDevelopmentFeatures, DEVELOPMENT_API_KEY, DEVELOPMENT_ENABLED, project, DEV)
}

async function RebuildProdCache (req, res, next, project=null) {
    await RebuildCache(req, QueryProductionFeatures, PRODUCTION_API_KEY, PRODUCTION_ENABLED, project, PROD)
}

async function buildProjectPayload (project, QueryFeaturesFunction, apiKey, enabledType) {
    let features = await QueryFeaturesFunction(project[apiKey])
    let variables = extractVariables(features)
    variables = await QueryVariablesById(variables)
    return buildPayload(variables, enabledType) 
}

async function RebuildCache (req, QueryFeaturesFunction, apiKey, enabledType, passedProject, cacheType) {
    try {
        let project = await GetProject(req, passedProject)
        let payload = await buildProjectPayload(project, QueryFeaturesFunction, apiKey, enabledType)
        await setCache(project[apiKey], payload)
        console.log(`Successfully Rebuilt ${cacheType} Cache`)
    } catch (error) {
        console.error(error)
    }
}

async function RebuildBothCaches (req) {
    try {
        let project = await GetProject(req, null)
        await Promise.all([
            RebuildDevCache(req, null, null, project), 
            RebuildProdCache(req, null, null, project), 
        ])
    } catch (error) {
        console.error(error)
    }
}

async function DestroyCachedResults (req) {
    try {
        let { 
            productionApiKey,  
            developmentApiKey, 
        } = req
        await Promise.all([
            removeKey(productionApiKey), 
            removeKey(developmentApiKey),
        ])
        console.log('Successfully Destroyed Prod and Dev Caches')
    } catch (error) {
        console.error(error)
    }
}

async function BuildPayloadOnTheFly (apiKey) {
    try {
        let getProject = await queryByApiKey(apiKey)
        if (!getProject){
            return null
        }
        if (isProductionKey(apiKey)){
            return buildProjectPayload(getProject, QueryProductionFeatures, apiKey, PROD)
        }
        else if (isDevelopmentKey(apiKey)){
            return buildProjectPayload(getProject, QueryDevelopmentFeatures, apiKey, DEV)
        }
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}


module.exports = {
    RebuildDevCache, 
    RebuildProdCache, 
    RebuildBothCaches, 
    DestroyCachedResults, 
    BuildPayloadOnTheFly, 
}