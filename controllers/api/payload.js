const { BadApiKeyError } = require('../../helpers/common-error-messages')
const { getApiHeaders } = require('../../helpers/Api-Key-Helpers')
const { SearchCache } = require('../../helpers/Cache-Helpers')
const { CachedResourceValid } = require('../../helpers/http-responses/Success-Messages')

async function GetPayload (req, res) {
    try {
        let apiKey = getApiHeaders(req)
        let payload = await SearchCache(apiKey)
        let client_last_updated = Number(req.query.last_updated)
        if (!payload){
            return BadApiKeyError(res)
        }
        if (payload?.last_updated === client_last_updated){
            return CachedResourceValid(res)
        }
        return res.json(payload)
    } catch (error) {
        res.status(500)
        console.error(error)
    }
}


module.exports = {
    GetPayload, 
}


