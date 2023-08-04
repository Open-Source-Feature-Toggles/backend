const path = require('path')
const dotenv = require('dotenv')
let run = false 

if (!run) { LoadEnvironment() }

function LoadEnvironment () {

    // Load Environment Variables and Connect Mongo 
    switch (process.env.NODE_ENV) {
        case 'production' : 
            dotenv.config({ path : path.join(__dirname, '../../.env') })
            break
        case 'development' : 
            dotenv.config({ path : path.join(__dirname, '../../.env.development') })
            break 
        case 'testing' :
            dotenv.config({ path : path.join(__dirname, '../../.env.testing') })
            break 
    }

    // Load Database and Redis 
    require('./mongo.config')
    require('./redis.config')
}


