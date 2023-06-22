const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const variableSchema = new Schema({
    name : { type: Schema.Types.String, require: true }, 
    active : { type : Schema.Types.Boolean, require : true}, 
    parentFeatureName: { type: Schema.Types.String, require: true },
    parentFeatureID : { type: Schema.Types.ObjectId, require: true },  
    owner: { type: Schema.Types.String, require: true }, 
    created : { type: Schema.Types.Date, require: true } 
})

module.exports = mongoose.model('Variable', variableSchema)
