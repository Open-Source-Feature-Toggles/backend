const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const featureSchema = new Schema({
    name : { type: Schema.Types.String, require: true }, 
    variableName : { type: Schema.Types.String, require: true }, 
    variables: [{
        type: Schema.Types.ObjectId, 
        ref : "Variable",
        require: true, 
    }], 
    description : { type: Schema.Types.String }, 
    developmentEnabled : { type: Schema.Types.Boolean, require : true, default : false }, 
    productionEnabled : { type: Schema.Types.Boolean, require : true, default : false }, 
    parentProjectName : { 
        type : Schema.Types.String, 
        ref : "project", 
        require: true, 
    }, 
    parentProjectID : { type: Schema.Types.ObjectId, require : true },
    productionApiKey : { type : Schema.Types.String, require: true }, 
    developmentApiKey : { type : Schema.Types.String, require: true },
    owner: { type: Schema.Types.String, require: true }, 
}, { timestamps : true })

module.exports = mongoose.model('Feature', featureSchema) 