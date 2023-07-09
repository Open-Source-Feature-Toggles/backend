const redisClient = require('../providers/redisClient')
const { 
    MissingApiKeyError, 

} = require('../helpers/common-error-messages')
const { getApiHeaders } = require('../helpers/Api-Key-Helpers')
const { SearchCache } = require('../helpers/Cache-Helpers')
const { CachedResourceValid } = require('../helpers/http-responses/Success-Messages')

// Anytime that a feature or variable is updated, then the
// cache needs to be updated with the most current date 


async function FindCachedPayload (req, res, next) {
    let apiKey = getApiHeaders(req)
    req.apiKey = apiKey
    let client_last_updated = req.query.last_updated
    if (!apiKey) {
        return MissingApiKeyError(res)
    }
    if (!client_last_updated) {
        return next()
    }
    let cachedResource = await SearchCache(apiKey)
    if (cachedResource === client_last_updated) {
        return CachedResourceValid(res)
    }
    next()
}


module.exports = {
    FindCachedPayload, 
}