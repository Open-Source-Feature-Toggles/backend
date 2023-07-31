const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    ParseCookie
} = require('../../../.test-helpers/general-helpers')
const { makeUser } = require('../../../.test-helpers/testDataGenerators')
let app, fakeAccount
const GOOD_USERNAME = 'fakeuser' 
const GOOD_PASSWORD = 'fakepassword'
const BAD_USERNAME = 'badusername'
const BAD_PASSWORD = 'badpassword'

beforeAll( async () => {
    app = await SetupTestEnv()
    fakeAccount = await makeUser(app, GOOD_USERNAME, GOOD_PASSWORD)
})

afterAll( async () => {
    await TakeDownTestEnv()
})


describe('Login - Success cases', () => {
    async function SuccessfulLogin () {
        return await request(app)
        .post('/auth/login')
        .send({ username : GOOD_USERNAME, password: GOOD_PASSWORD})
    }
    let loginAttempt
    beforeAll( async () => {
        loginAttempt = await SuccessfulLogin()
    })

    it('Successfully logs you in and returns a 200 status', () => {
        expect(loginAttempt.status).toBe(200)
    })
    
    it('Successfully returns an accesstoken after logging in', () => {
        expect(loginAttempt.body).toHaveProperty('accessToken')
    })

    it('Successfully returns a JSONWEBTOKEN cookie', () => {
        let { cookie_name } = ParseCookie(loginAttempt)
        expect(cookie_name).toEqual('rjid')
    })
})


describe('Logn - Error cases', () => {
    async function UnsuccessfulLogin (username, password) {
        return await request(app)
            .post('/auth/login')
            .send({ username, password })
    } 

    it('Tries to log you in with a bad username and returns a 404 status', async () => {
        let loginAttempt = await UnsuccessfulLogin(BAD_USERNAME, GOOD_PASSWORD)
        expect(loginAttempt.status).toBe(404)
    }) 

    it('Tries to log you in with a good username but password and returns a 401 status', async () => {
        let loginAttempt = await UnsuccessfulLogin(GOOD_USERNAME, BAD_PASSWORD)
        expect(loginAttempt.status).toBe(401)
    })
})