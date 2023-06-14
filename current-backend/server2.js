const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const cron = require('node-cron')
const DefaultFlag = require('./models/default-flag')
dotenv.config()

const PORT = process.env.PORT || 3000 
const db_connect = process.env.CONNECTION_STRING  

// Express Middleware 

app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use(cors())

// Connect DB

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

app.get("/get-features", async (req, res) => {
    let feature_names = req.query.features
    let flags = await DefaultFlag.find({ name : { $in : feature_names }}).exec()
    res.json({ flags })
})


app.get("/all-features", async (req, res) => {
    let features = await DefaultFlag.find()
    res.json({features}) 
})


app.post("/change-feature-status/:feature_name", async (req, res) => {
    let feature = await DefaultFlag.findOne({name : req.params.feature_name})
    if (feature) { 
        feature.active = !feature.active 
        await feature.save()
        res.sendStatus(200)
    }
    else { 
        res.sendStatus(404)
    }

})



// Check for outdated flags every minute

cron.schedule('*/1 * * * *', async () => {
    let expired_flags = await DefaultFlag.find( { expiration_date : { $lt : new Date()}} )
    Promise.all(expired_flags.map( async (flag, _) => {
        flag.active = false 
        return await flag.save()
    }))
    console.log("Lets here it for the doggg!")
})


app.listen(PORT, () => {
    console.log(`[LISTENING] Listening on Port ${PORT}`)
})
