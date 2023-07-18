const path = require('path')
const dotenv = require('dotenv')
let run = false 

if (!run) { LoadEnvironment() }

function LoadEnvironment () {

    // Load Environment Variables and Connect Mongo 
    switch (process.env.NODE_ENV) {
        case 'development' : 
            dotenv.config({ path : path.join(__dirname, '../../.env.development') })
            require('./mongo.config')
            break 
        case 'testing' :
            dotenv.config({ path : path.join(__dirname, '../../.env.testing') })
            break  
    }

    // Load Redis 
    require('./redis.config')

}


