const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const DefaultFlagSchema = new Schema({
    name : { type: String, require: true }, 
    expiration_date : { type: Date, require: true}, 
    active: { type: Boolean, require: true }, 
}) 

module.exports = mongoose.model('DefaultFlag', DefaultFlagSchema) 