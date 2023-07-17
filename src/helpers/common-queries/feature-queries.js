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

function QueryProductionFeatures (apiKey) {
    return Feature.find({
        $and : [
            { productionEnabled : true }, 
            { productionApiKey : apiKey },
        ]
    })
}

function QueryDevelopmentFeatures (apiKey) {
    return Feature.find({
        $and : [
            { developmentEnabled : true }, 
            { developmentApiKey : apiKey },
        ]
    })
}

module.exports = { 
    FeatureExistsQuery, 
    QueryProductionFeatures, 
    QueryDevelopmentFeatures, 
} 