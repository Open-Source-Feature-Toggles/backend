const { randomBytes } = require('crypto')
const Project = require('../models/api/project')

function generateRandomKey () {
    return randomBytes(64).toString('base64').replace("/", "_")
}

async function generateApiKeys () {
    let goodKey = false 
    let productionApiKey, developmentApiKey
    while (!goodKey) {
        productionApiKey = generateRandomKey()
        developmentApiKey = generateRandomKey()
        let { clientKeyExists, developmentKeyExists } = await Promise.all([
            Project.findOne({ productionApiKey }), 
            Project.findOne({ developmentApiKey })
        ])
        if (!clientKeyExists && !developmentKeyExists){
            goodKey = true
        }
    }
    console.log(productionApiKey, developmentApiKey)
    return [ productionApiKey, developmentApiKey ] 
}

module.exports = {
    generateApiKeys
}