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
const getPayload = require('../.test-helpers/cache-helpers')
let app, options 

afterEach( async () => {
    await clearDatabase()
})

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

afterAll( async () => {
    await TakeDownTestEnv()
})



describe('Tests RebuildProdCache', () => {

    let oldProdCache, user, project, feature, variable, productionApiKey
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
        oldProdCache = await getPayload(app, productionApiKey)
    })  

    it('Changes the production status of feature and rebuilds the production cache', async () => {
        await feature.ChangeProductionStatus()
        let newProdCache = await getPayload(app, productionApiKey)
        console.log(newProdCache)
        // expect(oldProdCache.features[options.featureName]).toBe(undefined)
        // expect(oldProdCache.features[options.featureName]).toBe()
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