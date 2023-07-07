const { randomBytes } = require('crypto')
const Project = require('../models/api/project')

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
        productionApiKey = generateDevelopmentKey()
        developmentApiKey = generateProductionKey()
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
    generateApiKeys
}