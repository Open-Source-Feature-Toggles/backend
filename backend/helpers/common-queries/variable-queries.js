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

module.exports = {
    findVariableParentQuery, 
    findVariableQuery
}