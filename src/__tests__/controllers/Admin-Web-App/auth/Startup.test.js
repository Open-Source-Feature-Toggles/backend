const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
} = require('../../../.test-helpers/general-helpers')
const { makeUser } = require('../../../.test-helpers/testDataGenerators')
let app, fakeUser
const USERNAME = 'fakeuser' 
const PASSWORD = 'fakepassword'

beforeAll( async () => {
    app = await SetupTestEnv()
    fakeUser = await makeUser(app, USERNAME, PASSWORD)
})

afterAll( async () => {
    await TakeDownTestEnv()
})


describe('Launch-App - Success Cases', () => {
    let callLaunchApp
    async function SuccessfulLaunchCall () {
        let { full_cookie } = fakeUser.cookie
        return await request(app)
            .post('/auth/launch-app')
            .set('cookie', full_cookie)
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

describe('Launch-App - Error Cases', () => {
    it('Receives a 401 status when it doesn\'t provide a refreshToken', async () => {
        let callLaunchApp = await request(app)
            .post('/auth/launch-app')
            .send()
        expect(callLaunchApp.status).toBe(401)
    })
})