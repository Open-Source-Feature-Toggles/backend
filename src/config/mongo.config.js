const mongoose = require('mongoose')

if (process.env.NODE_ENV === 'development'){
    ConnectDB(process.env.CONNECTION_STRING)
}

async function ConnectDB (connection_string) {
    try {
        let connection = await mongoose.connect(connection_string)
        console.log(`[CONNECTED] Mongo`)
    } catch (error) {
        console.error('Mongoose Failed to Connect')
    }
}