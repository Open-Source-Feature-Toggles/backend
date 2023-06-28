const Feature = require('../../models/api/feature')

function FeatureExistsQuery (name, username, projectName) {
    return Feature.findOne({
        $and : [
            { $and : [
                { name },
                { owner : username }, 
            ]}, 
            { parentProjectName : projectName }
        ]
    })
}

module.exports = FeatureExistsQuery