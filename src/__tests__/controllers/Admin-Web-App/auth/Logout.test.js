const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    createFakeAccount, 
    ParseCookie, 
} = require('../../../test-helpers')
const { makeUser } = require('../../../testDataGenerators')
const { clearDatabase } = require('../../../../config/in-memory-mongo.config')
const User = require('../../../../models/auth/user')
let app
let fakeAccount   
const USERNAME = 'fakeuser'
const PASSWORD = 'password'

beforeAll( async () => {
    app = await SetupTestEnv()
})

beforeEach(async () => {
    await clearDatabase()
    fakeAccount = await makeUser(app, USERNAME, PASSWORD)
})

afterAll( async () => {
    await TakeDownTestEnv()
})


async function GetUserByRefreshToken (refreshToken) {
    let getUser = await User.findOne({ refreshToken })
    return getUser
}

async function SuccessfulLogout () {
    return await request(app)
        .delete('/auth/logout')
        .set('Cookie', fakeAccount.getFullCookie())
        .send({ username : USERNAME })
}


describe('Successfully logs a user out of their account', () => {
    it('Successfully deletes refresh token from user\'s db entry', async () => {
        let { jwt } = fakeAccount.cookie
        let UserHasToken = await GetUserByRefreshToken(jwt)
        await SuccessfulLogout()
        let UserDoesNotHaveToken = await GetUserByRefreshToken(jwt)
        expect(UserHasToken).toHaveProperty('refreshToken')
        expect(UserDoesNotHaveToken).toBe(null)
    })  
})

describe('Unsuccessfully logs a user out of their acount', () => {
    it('Successfully returns 401 when no refreshToken is provided', async () => {
        let unSuccessfulLogout = await request(app)
            .delete('/auth/logout')
            .send({ username : USERNAME })
        expect(unSuccessfulLogout.status).toBe(401)
    })
})