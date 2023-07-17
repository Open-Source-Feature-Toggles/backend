const Variable = require('../../models/api/variable')
const Feature = require('../../models/api/feature')

function findVariableParentQuery (name, owner, parentProject) {
    return Feature.findOne({
        $and : [
            { $and : [
                { name }, 
                { owner }
            ]}, 
            { parentProjectName : parentProject }
        ]
    })
} 

function findVariableQuery ( name, owner, parentFeature ) {
    return Variable.findOne({
        $and : [
            { $and : [
                { name }, 
                { parentFeatureName: parentFeature }
            ]}, 
            { owner }
        ]
    })
}

function QueryVariablesById ( list_of_variable_ids ) {
    return Variable.find({
        _id : { $in : list_of_variable_ids }
    })
}


function QueryDevelopmentVariables ( list_of_variable_ids ) {
    return Variable.find({
        $and : [
            { _id : { $in : list_of_variable_ids }}, 
            { developmentEnabled : true }, 
        ]
    })
}

function QueryProductionVariables ( list_of_variable_ids ) {
    return Variable.find({
        $and : [
            { _id : { $in : list_of_variable_ids }}, 
            { productionEnabled : true }, 
        ]
    })
}



module.exports = {
    findVariableParentQuery, 
    findVariableQuery, 
    QueryVariablesById, 
    QueryDevelopmentVariables, 
    QueryProductionVariables, 
}