const {
    SetupTestEnv, 
    TakeDownTestEnv,
    clearDatabase 
} = require('../../.test-helpers/test-env-manager')
const { makeUserProjectFeatureandVariable } = require('../../.test-helpers/testDataGenerators')
const { 
    getVariableFromCache,  
    requestPayload, 
    getProjectsCacheEntries, 
    flushCache, 
} = require('../../.test-helpers/cache-test-helpers')
const request = require('supertest')
const fakeData = require('../../.test-helpers/constants')

let user, project, feature, variable

beforeAll( async () => {
    let app = await SetupTestEnv()
    fakeData.app = app 
})

afterAll( async () => {
    await TakeDownTestEnv()
})

beforeEach( async () => {
    let {
        fakeUser, 
        fakeProject, 
        fakeFeature, 
        fakeVariable
    } = await makeUserProjectFeatureandVariable(fakeData)
    await fakeFeature.ChangeDevelopmentStatus()
    await fakeFeature.ChangeProductionStatus()
    user = fakeUser
    project = fakeProject
    feature = fakeFeature
    variable = fakeVariable
})

afterEach( async () => {
    await clearDatabase()
})


describe('GetPayload - Success Cases', () => {

    let devPayloadResponse, prodPayloadResponse
    beforeEach( async () => {
        devPayloadResponse = await requestPayload(fakeData.app, project.state.developmentApiKey)
        prodPayloadResponse = await requestPayload(fakeData.app, project.state.productionApiKey)
    })
    it('Should call GetPayload and return a 200 status', async () => {
        expect(devPayloadResponse.status).toBe(200)
        expect(prodPayloadResponse.status).toBe(200)
    })
    it('Should call GetPayload and return an up to date payload', async () => {
        let devPayload = devPayloadResponse.body
        let prodPayload = prodPayloadResponse.body
        expect(getVariableFromCache(devPayload, fakeData.featureName, fakeData.newVariableName)).toBe(false)
        expect(getVariableFromCache(devPayload, fakeData.featureName, fakeData.initialVariableKey)).toBe(false)
        expect(getVariableFromCache(prodPayload, fakeData.featureName, fakeData.newVariableName)).toBe(false)
        expect(getVariableFromCache(prodPayload, fakeData.featureName, fakeData.initialVariableKey)).toBe(false)
    })
    it('Should call GetPayload matching last_updated value and get a 304 status', async () => {
        let callDevAgain = await requestPayload(fakeData.app, project.state.developmentApiKey, devPayloadResponse.body.last_updated)
        let callProdAgain = await requestPayload(fakeData.app, project.state.productionApiKey, prodPayloadResponse.body.last_updated)
        expect(callDevAgain.status).toBe(304)
        expect(callProdAgain.status).toBe(304)
    })
    it('Should call GetPayload and return an accurate payload when the cache is empty', async () => {
        /* 
        * In order to test that the GetPayload controller works, even in the scenario when the cache 
        * is empty, we have to manually flush it. We ensure its empty by getting the cache entries
        * and comparing them against the payload. 
        */
        await flushCache()
        let [
            devCache, 
            prodCache
        ] = await getProjectsCacheEntries(project)
        let devPayload = (await requestPayload(fakeData.app, project.state.developmentApiKey)).body
        let prodPayload = (await requestPayload(fakeData.app, project.state.productionApiKey)).body
        expect(getVariableFromCache(devCache, fakeData.featureName, fakeData.newVariableName)).toBe(undefined)
        expect(getVariableFromCache(prodCache, fakeData.featureName, fakeData.newVariableName)).toBe(undefined)
        expect(getVariableFromCache(devPayload, fakeData.featureName, fakeData.newVariableName)).toBe(false)
        expect(getVariableFromCache(devPayload, fakeData.featureName, fakeData.initialVariableKey)).toBe(false)
        expect(getVariableFromCache(prodPayload, fakeData.featureName, fakeData.newVariableName)).toBe(false)
        expect(getVariableFromCache(prodPayload, fakeData.featureName, fakeData.initialVariableKey)).toBe(false)
    })
})


describe('GetPayload - Error Cases', () => {

    it('Should call GetPayload without an apiKey and return a 401 status', async () => {
        let badResponse = await request(fakeData.app).get('/api/payload')
        expect(badResponse.status).toBe(401)
    })
})


