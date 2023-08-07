const redis = require('redis')
let client, cacheConnected = false 
let attempts = 0 

async function connect_redis () {
    try {
        client = redis.createClient({
            url : process.env.REDIS_URL, 
            password : process.env.REDIS_PASSWORD, 
            socket: {
              reconnectStrategy: retries => { console.log(retries) ; return Math.min(retries * 50, 5000) } 
            }
        })
        client.on('ready', () => {
            cacheConnected = true 
            console.log(`[CONNECTED] Redis`)
        })
        client.on('error', () => {
            console.log(`Attempting to connect ${++attempts}`)
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