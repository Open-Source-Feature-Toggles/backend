const request = require('supertest')
const client = require('../../config/redis.config')

async function requestPayload (app, apiKey) {
    let response = await request(app)
        .get('/api/payload')
        .set('Authorization', apiKey)
    return response.body
}

function getVariableFromCache (cache, feature, variable) {
    let feature_exists = cache?.['features'][feature] 
    if (feature_exists){
        for (let entry of feature_exists){
            if (entry.hasOwnProperty(variable)){
                return entry[variable]
            }
        }
        return undefined
    }
}

async function showKeys () {
    return await client.sendCommand(['KEYS', '*'])
}

async function getOutputByKey (key) {
    let string = await client.sendCommand(['GET', `${key}`])
    return JSON.parse(string)
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


module.exports = { 
    getPayload, 
    getVariableFromCache, 
    showKeys, 
    getOutputByKey, 
    readCache,  
    getPayload, 
}