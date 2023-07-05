const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const db_string = process.env.CONNECTION_STRING

async function connect_db () {
    try {
        let connection = await mongoose.connect(db_string)
        console.log(`[CONNECTED] to ${connection.connection.name}`)
    } catch (error) {
        console.log(error)
    }
}

connect_db()

module.exports = mongoose