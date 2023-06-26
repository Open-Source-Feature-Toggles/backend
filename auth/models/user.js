const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const userSchema = new Schema({
    username : { type: Schema.Types.String, require: true },
    password : { type: Schema.Types.String, require: true },
    created : { type: Schema.Types.Date, require: true }, 
    refreshToken : { type: String }, 
}) 


module.exports = mongoose.model('User', userSchema)
