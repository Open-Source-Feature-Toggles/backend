const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    createFakeAccount, 
    ParseCookie, 
    FakeUser, 
} = require('../../../test-helpers')
let app, fakeUser 
const USERNAME = 'fakeuser' 
const PASSWORD = 'fakepassword'

beforeAll( async () => {
    app = await SetupTestEnv()
    fakeUser = new FakeUser(USERNAME, PASSWORD)
    await fakeUser.createFakeAccount(app)
})

afterAll( async () => {
    await TakeDownTestEnv()
})


describe('Tests ChangeProductionStatus function in Feature Controller', () => {
    
    let attempt 
    async function SuccessfulFunctionCall () {
        return await request(app)
            .post('/features/change-production-status')
            .set('Cookie', fakeUser.cookie.cookie)
            .send({})
    }


    it('says hello', async () => {
        console.log('hello')
    })



})

describe('Tests ChangeDevelopmentStatus function in Feature Controller', () => {

})

describe('Tests DeleteFeature function in Feature Controller', () => {

})

describe('Tests MakeNewFeature function in Feature Controller', () => {

})