const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const ExpiredFlagSchema = new Schema({
    name : { type: String, require: true }, 
    expired : { type: Date, require: true}, 
    initially_created: { type : Date, require: true }, 
}) 

module.exports = mongoose.model('ExpiredFlag', ExpiredFlagSchema) 