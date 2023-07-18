const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    createFakeAccount, 
} = require('../../../test-helpers')
const { clearDatabase } = require('../../../../src/config/in-memory-mongo.config')
const User = require('../../../../src/models/auth/user')
let app
let fakeAccount, cookie, refreshToken   
const USERNAME = 'fakeuser'
const PASSWORD = 'password'

beforeAll( async () => {
    app = await SetupTestEnv()
})

beforeEach(async () => {
    await clearDatabase()
    fakeAccount = await createFakeAccount(app, USERNAME, PASSWORD)
    cookie = fakeAccount.headers['set-cookie'][0].split(';')[0].split('=')
    refreshToken = cookie[1]
    cookie = `${cookie[0]}=${cookie[1]}`
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
        .set('Cookie', cookie)
        .send({ username : USERNAME })
}


describe('Successfully logs a user out of their account', () => {
    it('Successfully deletes refresh token from user\'s db entry', async () => {
        let UserHasToken = await GetUserByRefreshToken(refreshToken)
        await SuccessfulLogout()
        let UserDoesNotHaveToken = await GetUserByRefreshToken(refreshToken)
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