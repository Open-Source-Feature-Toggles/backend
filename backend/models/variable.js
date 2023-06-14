const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const variableSchema = new Schema({
    name : { type: Schema.Types.String, require: true }, 
    active : { type : Schema.Types.Boolean, require : true}, 
    parentFeature: { type: Schema.Types.ObjectId, require: true }, 
    owner: { type: Schema.Types.ObjectId, require: true }, 
    created : { type: Schema.Types.Date, require: true } 
})

module.exports = mongoose.model('Variable', variableSchema)