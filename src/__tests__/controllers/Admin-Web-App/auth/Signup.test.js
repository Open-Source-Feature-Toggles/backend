const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    LoginFakeAccount, 
    ParseCookie, 
} = require('../../../test-helpers')
let app
const USERNAME = 'fakeuser' 
const PASSWORD = 'fakepassword'
const CONFIRM_PASSWORD = PASSWORD
let signUpAttempt

beforeAll( async () => {
    app = await SetupTestEnv()
    signUpAttempt = await SuccessfulSignup()
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

describe('Successfully signs you up for an account', () => {

    it('Successfully signs you up and performs a login with the same credentials', async () => {
        let loginAttempt = await LoginFakeAccount(app, USERNAME, PASSWORD)
        expect(loginAttempt.status).toBe(200)
    })

    it('Successfully signs you up for an account and /auth/sign-up returns a 200 status', async () => {
        expect(signUpAttempt.status).toBe(200)
    })

    it('Successfully returns the user an accessToken after signing you up', async () => {
        expect(signUpAttempt.body).toHaveProperty('accessToken')
    })

    it('Successfully returns the user a JSONWEBTOKEN cookie', async () => {
        let { cookie_name } = ParseCookie(signUpAttempt)
        expect(cookie_name).toEqual('rjid')
    })
})


describe('Unsuccessfully signs you up for an account', () => {

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


