const express = require('express')

function CreateApp () {
    require('./config/environment.config')
    const cors = require('cors')
    const morgan = require('morgan')
    const cookie_parser = require('cookie-parser')
    const app = express()
    const projectRoutes = require('./routes/Admin-Web-App/administrative/projects')
    const featuresRoutes = require('./routes/Admin-Web-App/administrative/features') 
    const variableRoutes = require('./routes/Admin-Web-App/administrative/variables')
    const authRoutes = require('./routes/Admin-Web-App/authRoutes')
    const apiRouter = require('./routes/api/api-router')
    
    
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