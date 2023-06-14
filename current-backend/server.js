const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()
dotenv.config()

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
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))


// Routes

app.use("/", require("./routes/index"))





app.listen(PORT, () => {
    console.log(`[LISTENING] on PORT ${PORT}`)
})