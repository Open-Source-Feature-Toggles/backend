const mongoose = require('mongoose')
const { join } = require('path')
const dotenv = require('dotenv')

// Configure Environment
if (process.env.NODE_ENV === 'development'){
    dotenv.config({ path : join(__dirname, `../../.development.env`) })
}

async function ConnectDB () {
    try {
        let connection = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log(`[CONNECTED] Mongo`)
    } catch (error) {
        console.error('Mongoose Failed to Connect')
    }
}

ConnectDB()
