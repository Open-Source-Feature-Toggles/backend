const {
    SetupTestEnv,
    TakeDownTestEnv, 
    clearDatabase, 
} = require('../.test-helpers/general-helpers') 
const {
    makeUser, 
    makeFeature, 
    makeVariable, 
    makeUsernandProject, 
    makeUserProjectAndFeature, 
    makeUserProjectFeatureandVariable, 
} = require('../.test-helpers/testDataGenerators')
const {
    readCache, 
    getPayload,
    getVariableFromCache, 
} = require('../.test-helpers/cache-helpers')

let app, options 
let user, project, feature, variable, productionApiKey, developmentApiKey
let oldDevCache, emptyProdCache
 
// jest.setTimeout(60000)

beforeAll( async () => {
    app = await SetupTestEnv()
    options = {
        app : app, 
        username : 'fakeuser', 
        password : 'fakepassword', 
        projectName : 'fake-project', 
        featureName : 'fake-feature', 
        description : 'fake-description', 
        initialVariableKey : 'variable-key', 
        featureVariableName : 'variable-1', 
        newVariableName : 'variable-2'
    }    
})

// variable-key
// variable-2

afterAll( async () => {
    await TakeDownTestEnv()
})

beforeEach( async () => {
    let { 
        fakeUser, 
        fakeProject, 
        fakeFeature, 
        fakeVariable, 
    } = await makeUserProjectFeatureandVariable(options)
    user = fakeUser
    project = fakeProject
    feature = fakeFeature
    variable = fakeVariable
    productionApiKey = project.state.productionApiKey
    developmentApiKey = project.state.developmentApiKey
    emptyDevCache = await readCache(developmentApiKey)
    emptyProdCache = await readCache(productionApiKey)
})  

afterEach( async () => {
    await clearDatabase()
})


describe('Tests that the Production Cache is properly rebuilt', () => {
    
    beforeEach( async () => {
        await feature.ChangeProductionStatus()   
    })
     
    it('Turns a feature\'s production status on', async () => {
        /* 
        * This test first enables a feature to be used in production 
        * and then checks to make sure that the cache contains the correct 
        * booleans for each of the feature's variables  
        */
        let updatedCache = await readCache(productionApiKey)
        expect(getVariableFromCache(emptyProdCache, options.featureName, options.initialVariableKey)).toBe(undefined)
        expect(getVariableFromCache(emptyProdCache, options.featureName, options.featureVariableName)).toBe(undefined)
        expect(getVariableFromCache(updatedCache, options.featureName, options.initialVariableKey)).toBe(false)
        expect(getVariableFromCache(updatedCache, options.featureName, options.newVariableName)).toBe(false)
    })
    it('Turns a variable\'s production status on', async () => {
        /* 
        * This test enables a variable to be shown in a production environment 
        * and checks the cache to ensure the variable's boolean was set to true
        */
        let cacheBeforeChange = await readCache(productionApiKey)
        await variable.UpdateProductionStatus()
        let cacheAfterChange = await readCache(productionApiKey)
        expect(getVariableFromCache(cacheBeforeChange, options.featureName, options.newVariableName)).toBe(false)
        expect(getVariableFromCache(cacheAfterChange, options.featureName, options.newVariableName)).toBe(true)
    })
    it('Turns a feature\'s production status back off after being turned on', async () => {
        /* 
        * This test disables a feature to be shown in a production environment and ensures
        * that it is properly removed from the cache 
        */
        let cacheBeforeChange = await readCache(productionApiKey)
        await feature.ChangeProductionStatus()
        let cacheAfterChange = await readCache(productionApiKey)
        expect(feature.state.productionEnabled).toBe(false)
        expect(getVariableFromCache(cacheBeforeChange, options.featureName, options.newVariableName)).toBe(false)
        expect(getVariableFromCache(cacheAfterChange, options.featureName, options.newVariableName)).toBe(undefined)
    })
})

describe('Tests that the Development Cache is properly rebuilt', () => {

    beforeEach( async () => {
        await feature.ChangeDevelopmentStatus()
    })

    it('Turns a feature\'s development status on', async () => {
        /* 
        * This test first enables a feature to be used in development 
        * and then checks to make sure that the cache contains the correct 
        * booleans for each of the feature's variables 
        */
        let updatedCache = await readCache(developmentApiKey)
        expect(getVariableFromCache(emptyDevCache, options.featureName, options.initialVariableKey)).toBe(undefined)
        expect(getVariableFromCache(emptyDevCache, options.featureName, options.featureVariableName)).toBe(undefined)
        expect(getVariableFromCache(updatedCache, options.featureName, options.initialVariableKey)).toBe(false)
        expect(getVariableFromCache(updatedCache, options.featureName, options.newVariableName)).toBe(false)
    })
    it('Turns a variable\'s development status on', async () => {
        /* 
        * This test enables a variable to be shown in a production development 
        * and checks the cache to ensure the variable's boolean was set to true
        */
        let cacheBeforeChange = await readCache(developmentApiKey)
        await variable.UpdateDevelopmentStatus()
        let cacheAfterChange = await readCache(developmentApiKey)
        expect(getVariableFromCache(cacheBeforeChange, options.featureName, options.newVariableName)).toBe(false)
        expect(getVariableFromCache(cacheAfterChange, options.featureName, options.newVariableName)).toBe(true)
    })
    it('Turns a feature\'s production status back off after being turned on', async () => {
        /* 
        * This test disables a feature to be shown in a development environment and ensures
        * that it is properly removed from the cache 
        */
        let cacheBeforeChange = await readCache(developmentApiKey)
        await feature.ChangeDevelopmentStatus()
        let cacheAfterChange = await readCache(developmentApiKey)
        expect(feature.state.developmentEnabled).toBe(false)
        expect(getVariableFromCache(cacheBeforeChange, options.featureName, options.newVariableName)).toBe(false)
        expect(getVariableFromCache(cacheAfterChange, options.featureName, options.newVariableName)).toBe(undefined)
    })

})




/*

RebuildProdCache 
-------------------
- /features/change-production-status 
- /variables/change-production-status

RebuildDevCache 
-------------------
- /features/change-development-status
- /variables/change-development-status

RebuildBothCaches 
-------------------
- /features/make-new-features
- /features/delete-feature
- /variables/make-new-variable
- /variables/delete-variable


DestroyBothCachedResult 
-------------------
- /projects/delete-project

*/




/* 
describe('Tests RebuildDevCache', () => {

})
describe('Tests RebuildBothCaches', () => {

})
describe('Tests DestroyBothCaches', () => {

})
*/ 