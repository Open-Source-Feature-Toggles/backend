const redis = require('redis')
let client, cacheConnected = false 

async function connect_redis () {
    try {
        client = redis.createClient()
        await client.connect()
        cacheConnected = true 
        console.log(`[CONNECTED] Redis`)
    } catch (error) {
        console.error(`Failed to Connect to Redis Client`)
    }
}

function isCacheConnected () {
    return cacheConnected
}

if (!client){
    connect_redis()
}

module.exports =  { 
    client,  
    isCacheConnected, 
} 