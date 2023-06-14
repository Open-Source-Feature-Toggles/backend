const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const DefaultFlagSchema = new Schema({
    name : { type: String, require: true }, 
    expiration_date : { type: Date, require: true}, 
    active: { type: Boolean, require: true }, 
    dateCreated : { type: Date }, 
    numUserInteractions : { type : Date }, 
    datesActive : { type : Array }, 
}) 

module.exports = mongoose.model('DefaultFlag', DefaultFlagSchema) 