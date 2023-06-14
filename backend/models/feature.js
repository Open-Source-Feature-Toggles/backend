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
    developmentEnabled : { type: Schema.Types.Boolean, require : true }, 
    productionEnabled : { type: Schema.Types.Boolean, require : true }, 
    parentProject : { 
        type : Schema.Types.ObjectId, 
        ref : "project", 
        require: true, 
    }, 
    owner: { type: Schema.Types.ObjectId, require: true }, 
    created : { type: Schema.Types.Date, require: true } 
})

module.exports = mongoose.model('Feature', featureSchema) 