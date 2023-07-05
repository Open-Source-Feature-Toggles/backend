const redis = require('redis')

const redisClient = redis.createClient()
async function connect_redis () {
    await redisClient.connect()
    console.log("[CONNECTED] to Redis Cache")
}
connect_redis()

module.exports = redisClient