const request = require('supertest')


async function getPayload (app, apiKey) {
    let response = await request(app)
        .get('/api/payload')
        .set('Authorization', apiKey)
    return response.body
}

function getVariableFromCache (cache, feature, variable) {
    return cache?.features.feature?.variable
}

module.exports = { 
    getPayload, 
    getVariableFromCache
}