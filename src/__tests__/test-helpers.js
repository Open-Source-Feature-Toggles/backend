const request = require('supertest')
const CreateApp = require('../app')
const { 
    connect, 
    disconnect, 
    clearDatabase
} = require('../config/in-memory-mongo.config') 
const client = require('../config/redis.config')

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
    await client.sendCommand(['FLUSHALL'])
}

async function ClearDataBase() {
    await clearDatabase()
}

function ParseCookie (response_object) {
    let cookie = response_object.headers['set-cookie'][0].split(';')[0].split('=')
    let cookie_name = cookie[0]
    let jwt = cookie[1]
    cookie = `${cookie_name}=${jwt}`
    return { cookie, cookie_name, jwt } 
}


module.exports = { 
    createFakeAccount, 
    SetupTestEnv, 
    TakeDownTestEnv, 
    LoginFakeAccount, 
    ParseCookie, 
    clearDatabase, 
} 