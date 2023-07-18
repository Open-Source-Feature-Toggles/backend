const request = require('supertest')
const CreateApp = require('../src/app')
const { 
    connect, 
    disconnect, 
} = require('../src/config/in-memory-mongo.config') 

async function createFakeAccount (app, username, password) {
    const response = await request(app)
        .post('/auth/sign-up')
        .send({ username, password, confirm_password : password })
    return response 
}

async function LoginFakeAccount (app, username, password) {
    const response = await request(app)
        .post('/auth/login')
        .send({ username, password })
    return response 
}

async function SetupTestEnv () {
    await connect()
    app = CreateApp()
    return app
}

async function TakeDownTestEnv () {
    await disconnect()
}


module.exports = { 
    createFakeAccount, 
    SetupTestEnv, 
    TakeDownTestEnv, 
    LoginFakeAccount
} 