const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
} = require('../../../.test-helpers/test-env-manager')
const { 
    makeUser
} = require('../../../.test-helpers/testDataGenerators')
let app, fakeUser
const USERNAME = 'fakeuser' 
const PASSWORD = 'fakepassword'
const CONFIRM_PASSWORD = PASSWORD

beforeAll( async () => {
    app = await SetupTestEnv()
    fakeUser = await makeUser(app, USERNAME, PASSWORD)
})

afterAll( async () => {
    await TakeDownTestEnv()
})

async function SuccessfulSignup () {
    return await request(app)
        .post('/auth/sign-up')
        .send({
            username : USERNAME, 
            password : PASSWORD, 
            confirm_password : CONFIRM_PASSWORD, 
        })
}

describe('Signup - Success cases', () => {

    it('Successfully signs you up and performs a login with the same credentials', async () => {
        await fakeUser.LoginFakeAccount(app, USERNAME, PASSWORD)
        let loginAttempt = fakeUser.responses.LoginFakeAccountResponse
        expect(loginAttempt.status).toBe(200)
    })
    it('Successfully signs you up for an account and /auth/sign-up returns a 200 status', async () => {
        expect(fakeUser.responses.createFakeAccountResponse.status).toBe(200)
    })
    it('Successfully returns the user an accessToken after signing you up', async () => {
        expect(fakeUser.responses.createFakeAccountResponse.body).toHaveProperty('accessToken')
    })
    it('Successfully returns the user a JSONWEBTOKEN cookie', async () => {
        let { cookie_name } = fakeUser.cookie
        expect(cookie_name).toEqual('rjid')
    })
})


describe('Signup - Error cases', () => {

    async function unsuccessfulSignup(username, password, confirm_password){
        return await request(app)
            .post('/auth/sign-up')
            .send({
                username, 
                password, 
                confirm_password
            })
    }

    it('Attempts to signup with a username that is already taken', async () => {
        let badAttempt = await unsuccessfulSignup(USERNAME, PASSWORD, CONFIRM_PASSWORD)
        expect(badAttempt.status).toBe(409)
    })
    it('Attemps to signup when password !== confirm_password', async () => {
        let badAttempt = await unsuccessfulSignup(USERNAME, PASSWORD, 'incorrect-value')
        expect(badAttempt.status).toBe(409)
    })

})


