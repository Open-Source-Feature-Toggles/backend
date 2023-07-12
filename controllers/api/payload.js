const { BadApiKeyError } = require('../../helpers/common-error-messages')
const { getApiHeaders } = require('../../helpers/Api-Key-Helpers')
const { SearchCache } = require('../../helpers/caching/Redis-Helpers')
const { CachedResourceValid } = require('../../helpers/http-responses/Success-Messages')

/* 

REORDER OF GETPAYLOAD(REQ, RES) 
        
        let apiKey = getApiHeaders(req)
        let payload = await SearchCache(apiKey)
        let client_last_updated = Number(req.query.last_updated)
        if (payload?.last_updated === client_last_updated){
            return CachedResourceValid(res)
        }
        else if (payload) {
            return res.json(payload)
        }
        else {
            buildPayload for given apiKey 
                if apiKey does not map to any project, return error 
            save 'on the fly build to redis' 
            send payload 
        }
*/

async function GetPayload (req, res) {
    try {
        let apiKey = getApiHeaders(req)
        let payload = await SearchCache(apiKey)
        let client_last_updated = Number(req.query.last_updated)
        if (payload?.last_updated === client_last_updated){
            return CachedResourceValid(res)
        }
        else if (payload){
            return res.json(payload)
        }
        else {
            return true // buildPayloadOnTheFly
        }
    } catch (error) {
        res.status(500)
        console.error(error)
    }
}


module.exports = {
    GetPayload, 
}


