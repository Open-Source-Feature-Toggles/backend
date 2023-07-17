const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod = undefined 

async function connect () {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    return await mongoose.connect(uri) 
}

async function disconnect () {
    if (mongod){
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await mongod.stop()
    }
}

async function clearDatabase () {
    if (mongod) {
        const collections = mongoose.connection.collections
        for (const key in collections) {
            const collection = collections[key]
            await collection.deleteMany()
        }
    }
}


module.exports = {
    connect, 
    disconnect, 
    clearDatabase
}


/* 
This MongoMemoryServer boilerplate was largely inspried by @pawap90's 
'test-mongoose-inmemory' tutorial on GitHub. 

The repository can be found here => https://github.com/pawap90/test-mongoose-inmemory
*/
