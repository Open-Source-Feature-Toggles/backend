const redis = require('redis')
let client, cacheConnected = false 

async function connect_redis () {
    try {
        client = redis.createClient()
        client.on('ready', () => {
            cacheConnected = true 
            console.log(`[CONNECTED] Redis`)
        })
        client.on('error', () => {
            cacheConnected = false 
        })
        client.on('end', () => {
            cacheConnected = false 
        })
        await client.connect()
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