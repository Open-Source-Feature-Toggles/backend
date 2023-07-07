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

function QueryProductionFeatures (apiKey, projectID) {
    return Feature.find({
        $and : [
            { $and : [
                { productionApiKey : apiKey },
                { parentProjectID : projectID }, 
            ]}, 
            { productionEnabled : true }
        ]
    })
}

function QueryDevelopmentFeatures (apiKey, projectID) {
    return Feature.find({
        $and : [
            { $and : [
                { developmentApiKey : apiKey },
                { parentProjectID : projectID }, 
            ]}, 
            { developmentEnabled : true }
        ]
    })
}

module.exports = { 
    FeatureExistsQuery, 
    QueryProductionFeatures, 
    QueryDevelopmentFeatures, 
} 