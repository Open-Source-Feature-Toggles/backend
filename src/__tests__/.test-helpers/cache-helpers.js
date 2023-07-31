const request = require('supertest')


async function getPayload (app, apiKey) {
    let response = await request(app)
        .get('/api/payload')
        .set('Authorization', apiKey)
    return response.body
}

module.exports = getPayload