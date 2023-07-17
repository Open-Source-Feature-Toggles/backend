const mongoose = require('mongoose')

async function ConnectMongo (connection_string) {
    if (mongoose.connection.readyState){
        return
    }
    try {
        let connection = await mongoose.connect(connection_string)
        console.log(`[CONNECTED] Mongo`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = ConnectMongo