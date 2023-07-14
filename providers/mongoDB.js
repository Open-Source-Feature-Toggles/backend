const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

async function ConnectMongo (connection_string) {
    try {
        let connection = await mongoose.connect(connection_string)
        console.log(`[CONNECTED] Mongo`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = ConnectMongo