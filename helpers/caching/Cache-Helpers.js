const redisClient = require('../../providers/redisClient')
const { projectQuery } = require('../common-queries/project-queries')


async function SearchCache (apiKey) {
    try {
        let resource = await redisClient.get(apiKey)
        return JSON.parse(resource)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function setCache(apiKey, payload) {
    try {
        await redisClient.set(apiKey, JSON.stringify(payload)) 
    } catch (error) {
        console.error(error)
    }
}

async function removeKey (apiKey) {
    try {
        await redisClient.del(apiKey)
    } catch (error) {
        console.error
    }
}


async function removeKeyWithProject (project, user) {
    try { 
        if (typeof project === 'string'){
            let getProject = await projectQuery(project, user) 
            await Promise.all([
                redisClient.del(getProject.developmentApiKey), 
                redisClient.del(getProject.productionApiKey), 
            ])
        } 
        else if (typeof project === 'object') {
            await Promise.all([
                redisClient.del(project.developmentApiKey), 
                redisClient.del(project.productionApiKey), 
            ])
        } 
        else {
            throw new Error('Unable to adjust cache')
        }
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    SearchCache, 
    setCache, 
    removeKey, 
    removeKeyWithProject, 
}