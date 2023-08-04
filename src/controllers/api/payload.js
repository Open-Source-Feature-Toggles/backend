const { BadApiKeyError } = require('../../helpers/common-error-messages')
const { getApiHeaders } = require('../../helpers/Api-Key-Helpers')
const { SearchCache } = require('../../helpers/caching/Redis-Helpers')
const { CachedResourceValid } = require('../../helpers/http-responses/Success-Messages')
const { BuildPayloadOnTheFly, BuildCacheOnTheFly } = require('../../helpers/caching/Cache-Handlers')
const { isCacheConnected } = require('../../config/redis.config')
/* 

GetPayload 

    1. get apikey, payload, and client last_updated

    2. Error if no apikey nad payload 

    3. If the user already has a payload and is checking to see if it 
    is up to date, check to see if most recently updated date on payload 
    matches the users last_updated 

        If it matches, send them a 304

    4. If it doesn't match, but the payload exists, send the payload 
    
    5. If there is no payload, but a valid apikey was given, build and cache
    a payload for that apikey and also return it to the user 

*/

async function GetPayload (req, res) {
    try {
        let apiKey = getApiHeaders(req)
        if (!apiKey) {
            return BadApiKeyError(res)
        }
        if (!isCacheConnected()) {
            let payload = await BuildPayloadOnTheFly(apiKey)
            if (!payload) {
                return BadApiKeyError(res)
            }
            return res.json(payload)
        }
        let cachedPayload = await SearchCache(apiKey)
        let client_last_updated = Number(req.query.last_updated)
        if (!cachedPayload){
            let payload = await BuildCacheOnTheFly(req, apiKey)
            return res.json(payload)
        }
        else if (cachedPayload.last_updated === client_last_updated){
            return CachedResourceValid(res)
        }
        else if (cachedPayload){
            return res.json(cachedPayload)
        }
    } catch (error) {
        res.status(500)
        console.error(error)
    }
}


module.exports = {
    GetPayload, 
}


