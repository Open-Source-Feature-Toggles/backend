const redisClient = require('../providers/redisClient')



async function SearchCache (apiKey) {
    try {
        let resource = await redisClient.get(apiKey)
        return resource
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function setCache(apiKey, time) {
    try {
        await redisClient.set(apiKey, time) 
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