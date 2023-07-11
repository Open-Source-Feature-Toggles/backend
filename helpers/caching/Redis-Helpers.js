const redisClient = require('../../providers/redisClient')
const { projectQuery } = require('../common-queries/project-queries')


async function SearchCache (apiKey) {
    try {
        let resource = await redisClient.get(apiKey)
        return JSON.parse(resource)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function setCache(apiKey, payload) {
    try {
        await redisClient.set(apiKey, JSON.stringify(payload)) 
    } catch (error) {
        console.error(error)
    }
}

async function removeKey (apiKey) {
    try {
        await redisClient.del(apiKey)
    } catch (error) {
        console.error
    }
}


module.exports = {
    SearchCache, 
    setCache, 
    removeKey, 
}