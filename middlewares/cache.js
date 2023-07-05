const redisClient = require('../providers/redisClient')
const { noApiKeyHeaders } = require('../helpers/common-error-messages')

// Anytime that a feature or variable is updated, then the
// cache needs to be updated with the most current date 

function getApiHeaders (req, res) {
    let authHeader = req.headers.authorization 
    if (!authHeader){
        return noApiKeyHeaders(res)
    }
    return authHeader
}




async function checkCache (req, res, next) {
    let authHeader = getApiHeaders(req, res)
    let getCachedHeader = await redisClient.get(authHeader)
    if (!getCachedHeader) { return next() }
    
}







function sayHay () {
    console.log("HAY!")
}


module.exports = {
    sayHay, 
}