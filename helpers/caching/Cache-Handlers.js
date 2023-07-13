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

async function RebuildCache (req, QueryFeaturesFunction, apiKey, enabledType, passedProject, cacheType) {
    try {
        let project = await GetProject(req, passedProject)
        let features = await QueryFeaturesFunction(project[apiKey])
        let variables = extractVariables(features)
        variables = await QueryVariablesById(variables)
        let payload = buildPayload(variables, enabledType)
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

async function BuildPayloadOnTheFly (req, res, apiKey) {
    try {
        let getProject = await queryByApiKey(apiKey)
        if (!getProject){
            return BadApiKeyError(res)
        }
        await Promise.all([
            RebuildDevCache(req, null, null, getProject), 
            RebuildProdCache(req, null, null, getProject), 
        ])
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