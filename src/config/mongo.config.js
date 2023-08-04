const mongoose = require('mongoose')

switch (process.env.NODE_ENV) {
    case 'production' :
        ConnectDB(process.env.MONGO_PRODUCTION_STRING)
        break 
    case 'development' : 
        ConnectDB(process.env.MONGO_DEVELOPMENT_STRING)
        break 
}

async function ConnectDB (connection_string) {
    try {
        let connection = await mongoose.connect(connection_string)
        console.log(`[CONNECTED] Mongo`)
    } catch (error) {
        console.error('Mongoose Failed to Connect')
    }
}