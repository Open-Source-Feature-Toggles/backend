const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const DefaultFlag = require('./models/default-flag')
dotenv.config()

const PORT = process.env.PORT || 3000 
const db_connect = process.env.CONNECTION_STRING  

// Express Middleware 

app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use(cors())


mongoose.set('strictQuery', false) 
async function connect_the_goose (){
    let mongoose_connection_object = await mongoose.connect(db_connect)
    console.log(`Mongoose connected to collection: ${mongoose_connection_object.connection.name}`) 
}
connect_the_goose() 



app.get("/", (req, res) => {
    res.json({hi : "there"}) 
})

app.post("/make-feature", async (req, res) => {
    console.log(req.body)
    let new_feature = new DefaultFlag({
        name : req.body.name, 
        expiration_date : new Date(req.body.expiration_date), 
        active: req.body.active, 
    })
    try {
        await new_feature.save()
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


app.listen(PORT, () => {
    console.log(`[LISTENING] Listening on Port ${PORT}`)
})
