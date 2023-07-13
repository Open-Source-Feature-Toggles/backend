const redisClient = require('../../providers/redisClient')


async function SearchCache (apiKey) {
    try {
        let resource = await redisClient.get(apiKey)
        if (resource) {
            resource = JSON.parse(resource)
        }
        return resource
    } catch (error) {
        console.error(error)
    }
}

async function setCache(apiKey, payload) {
    try {
        return redisClient.set(apiKey, JSON.stringify(payload)) 
    } catch (error) {
        console.error(error)
    }
}

async function removeKey (apiKey) {
    try {
        return redisClient.del(apiKey)
    } catch (error) {
        console.error
    }
}


module.exports = {
    SearchCache, 
    setCache, 
    removeKey, 
}