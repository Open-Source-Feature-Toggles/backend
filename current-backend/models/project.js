const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const ProjectSchema = new Schema({
    name : { type: Schema.Types.String, require: true }, 
    features: [{
        type: Schema.Types.ObjectId, 
        ref : "Feature",
        require: true, 
    }], 
})

module.exports = mongoose.model('Project', ProjectSchema)
