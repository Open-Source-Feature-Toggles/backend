const request = require('supertest')
const CreateApp = require('../app')
const { 
    connect, 
    disconnect, 
    clearDatabase
} = require('../src/config/in-memory-mongo.config')
let app 


async function quickGuy () {
    const response = await request(app)
        .post('/auth/sign-up')
        .send({ username : 'fakeuser', password : 'fakepassword', confirm_password : 'fakepassword' })
    expect(response.status).toBe(200)
}



beforeAll( async () => {
    let connection_uri = await connect()
    app = CreateApp(true)
    await quickGuy()
})


afterAll( async () => {
    await disconnect()
})


describe('/login', () => {

    it('Logs in successfully and returns an accessToken', async () => {
        const response = await request(app).post('/auth/login')
            .send({ username: 'fakeuser', password : 'fakepassword' })
        expect(response.body).toHaveProperty('accessToken')
        expect(response.headers['set-cookie']).toBeDefined()
    })

})


