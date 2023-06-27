const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookie_parser = require('cookie-parser')
const app = express()
dotenv.config()
const projectRoutes = require('./routes/web/admin/projects')
const featuresRoutes = require('./routes/web/admin/features') 
const variableRoutes = require('./routes/web/admin/variables')
const authRoutes = require('./routes/web/authRoutes')


// Environment Variables
const PORT = process.env.PORT || 3000 
const db_string = process.env.CONNECTION_STRING

// Connect to mongodb
async function connect_db () {
    try {
        let connection = await mongoose.connect(db_string)
        console.log(`[CONNECTED] to ${connection.connection.name}`)
    } catch (error) {
        console.log(error)
    }
}
connect_db()

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
app.use('/auth', authRoutes)




app.listen(PORT, () => {
    console.log(`[LISTENING] on PORT ${PORT}`)
})