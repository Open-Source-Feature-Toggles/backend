const express = require('express')

function CreateApp (db_connected=false) {
    const path = require('path')
    const dotenv = require('dotenv').config({ path : path.join(__dirname, '.env.development') })
    const cors = require('cors')
    const morgan = require('morgan')
    const cookie_parser = require('cookie-parser')
    const app = express()
    const projectRoutes = require('./src/routes/Admin-Web-App/administrative/projects')
    const featuresRoutes = require('./src/routes/Admin-Web-App/administrative/features') 
    const variableRoutes = require('./src/routes/Admin-Web-App/administrative/variables')
    const authRoutes = require('./src/routes/Admin-Web-App/authRoutes')
    const apiRouter = require('./src/routes/api/api-router')

    // Connect Providers
    if (!db_connected){
        require('./src/config/mongo.config')
    }
    require('./src/config/redis.config')
    
    
    // Express Middleware 
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true, 
    }))
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended : true }))
    app.use(cookie_parser())
    
    // Routes
    app.use("/projects", projectRoutes)
    app.use("/features", featuresRoutes)
    app.use("/variables", variableRoutes)
    app.use("/auth", authRoutes)
    app.use("/api", apiRouter)

    return app
}

 


module.exports = CreateApp