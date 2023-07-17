const redis = require('redis')
let client 

async function connect_redis () {
    try {
        client = redis.createClient()
        await client.connect()
        console.log(`[CONNECTED] Redis`)
    } catch (error) {
        console.error(`Failed to Connect to Redis Client`)
    }
}

if (!client){
    connect_redis()
}

module.exports = client