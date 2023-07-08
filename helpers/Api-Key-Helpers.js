const { randomBytes } = require('crypto')
const Project = require('../models/api/project')

function getApiHeaders (req) {
    return req.headers.authorization
}

function isProductionKey (apiKey) {
    if (apiKey.split('.')[0] === 'PRODUCTION'){
        return true
    } else {
        return false 
    }
}

function isDevelopmentKey (apiKey) {
    if (apiKey.split('.')[0] === 'DEVELOPMENT'){
        return true
    } else {
        return false 
    }
}

function generateDevelopmentKey () {
    return "DEVELOPMENT." + randomBytes(64).toString('base64').replace("/", "_").replace(".", "-")
}

function generateProductionKey () {
    return "PRODUCTION." + randomBytes(64).toString('base64').replace("/", "_").replace(".", "-")
}

async function generateApiKeys () {
    let goodKey = false 
    let productionApiKey, developmentApiKey
    while (!goodKey) {
        productionApiKey = generateProductionKey()
        developmentApiKey = generateDevelopmentKey()
        let { clientKeyExists, developmentKeyExists } = await Promise.all([
            Project.findOne({ productionApiKey }), 
            Project.findOne({ developmentApiKey })
        ])
        if (!clientKeyExists && !developmentKeyExists){
            goodKey = true
        }
    }
    return [ productionApiKey, developmentApiKey ] 
}

module.exports = {
    getApiHeaders, 
    isProductionKey, 
    isDevelopmentKey, 
    generateApiKeys, 
}