const request = require('supertest')
const client = require('../../config/redis.config')

async function requestPayload (app, apiKey, last_updated=null) {
    let response = request(app)
        .get('/api/payload')
        .set('Authorization', apiKey)
    if (last_updated) {
        response = response.query({ last_updated })
    }
    return await response
}

function getVariableFromCache (cache, feature, variable) {
    let feature_exists = cache?.['features'][feature] 
    if (feature_exists){
        for (let entry of feature_exists){
            if (entry.hasOwnProperty(variable)){
                return entry[variable]
            }
        }
    }
    return undefined
}

async function showKeys () {
    return await client.sendCommand(['KEYS', '*'])
}

async function getOutputByKey (key) {
    let string = await client.sendCommand(['GET', `${key}`])
    return JSON.parse(string)
}

async function flushCache () {
    return await client.sendCommand(['FLUSHALL'])
}

async function readCache (apiKey) {
    return new Promise( (resolve) => {
        setTimeout( async () => {
            let cachedResult = await getOutputByKey(apiKey)
            resolve(cachedResult)
        }, 100);
    })
}

async function getPayload (app, apiKey) {
    return new Promise( (resolve) => {
        setTimeout( async () => {
            let payload = await requestPayload(app, apiKey)
            resolve(payload)
        }, 100)
    })
}

async function getProjectsCacheEntries (project) {
    let [ devCacheEntry, prodCacheEntry ] = await Promise.all([
        readCache(project.state.developmentApiKey), 
        readCache(project.state.productionApiKey)
    ])
    return [ devCacheEntry, prodCacheEntry ]
}


module.exports = { 
    getPayload, 
    getVariableFromCache, 
    showKeys, 
    getOutputByKey, 
    readCache,  
    getPayload, 
    getProjectsCacheEntries, 
    requestPayload, 
    flushCache, 
}