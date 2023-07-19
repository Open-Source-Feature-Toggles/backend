const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    createFakeAccount,
    ParseCookie, 
} = require('./../../../test-helpers')
let app, fakeUser
const USERNAME = 'fakeuser' 
const PASSWORD = 'fakepassword'
const CONFIRM_PASSWORD = PASSWORD

beforeAll( async () => {
    app = await SetupTestEnv()
    fakeUser = await createFakeAccount(app, USERNAME, PASSWORD, CONFIRM_PASSWORD)
})

afterAll( async () => {
    await TakeDownTestEnv()
})


describe('Successfully calls Launch App Route', () => {
    let callLaunchApp
    async function SuccessfulLaunchCall () {
        let { cookie } = ParseCookie(fakeUser)
        return await request(app)
            .post('/auth/launch-app')
            .set('cookie', cookie)
            .send()
    }
    beforeAll( async () => {
        callLaunchApp = await SuccessfulLaunchCall()
    })

    it('Receives a 200 status from launch-app', async () => {
        expect(callLaunchApp.status).toBe(200)
    })
    
    it('Receives an accessToken from launch-app', async () => {
        expect(callLaunchApp.body).toHaveProperty('accessToken')
    })
})

describe('Unsuccessfully calls Launch App Route', () => {
    it('Receives a 401 status when it doesn\'t provide a refreshToken', async () => {
        let callLaunchApp = await request(app)
            .post('/auth/launch-app')
            .send()
        expect(callLaunchApp.status).toBe(401)
    })
})