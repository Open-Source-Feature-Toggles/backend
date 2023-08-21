const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const variableSchema = new Schema({
    name : { type: Schema.Types.String, require: true }, 
    parentFeatureName: { type: Schema.Types.String, require: true },
    parentProjectName : { type : Schema.Types.String, require: true },  
    parentFeatureID : { type: Schema.Types.ObjectId, require: true },  
    developmentEnabled : { type: Schema.Types.Boolean, require : true, default : false }, 
    productionEnabled : { type: Schema.Types.Boolean, require : true, default : false }, 
    owner: { type: Schema.Types.String, require: true },  
}, { timestamps : true })

module.exports = mongoose.model('Variable', variableSchema)
