const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const everything_route = require('./routes/everything-4-now')
const second_route = require('./routes/second-route')
const cookie_parser = require('cookie-parser')
dotenv.config()
const morgan = require('morgan')


// DB
const db = process.env.CONNECTION_STRING
async function connect_the_goose () {
    let connection = await mongoose.connect(db)
    console.log(`[CONNECTED] Connected to ${connection.connection.name}`)
}
connect_the_goose()


// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
}))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(morgan('dev'))
app.use(cookie_parser())


// Stuff 
app.use("/", everything_route)
app.use("/auth", second_route)



app.listen(3000, () => {
    console.log(`listening on port 3000`)
})


