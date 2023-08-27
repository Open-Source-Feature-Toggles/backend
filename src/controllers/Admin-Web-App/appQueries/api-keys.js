const { queryAllUserProjects } = require('../../../helpers/common-queries/project-queries')
const { formatApiKeyData } = require('./data-cleaners/cleaner-api-keys')


async function getApiKeys (req, res) {
    try {
        let { user } = req
        let userProjects = await queryAllUserProjects(user)
        let cleanedData = formatApiKeyData(userProjects)
        res.json(cleanedData)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

module.exports = {
    getApiKeys, 
}