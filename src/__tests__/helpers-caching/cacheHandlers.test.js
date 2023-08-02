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
    getProjectsCacheEntries, 
} = require('../.test-helpers/cache-helpers')

let app, options 
let user, project, feature, variable, productionApiKey, developmentApiKey
let oldDevCache, emptyProdCache

const Feature = require('../../models/api/feature')
const Variable = require('../../models/api/variable')
const Project = require('../../models/api/project')

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

function runMakeUserProjectFeatureVariable () {
    return beforeEach( async () => {
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
}
  

afterEach( async () => {
    await clearDatabase()
})


describe('RebuildProdCache', () => {
    runMakeUserProjectFeatureVariable()
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


describe('RebuildDevCache', () => {
    runMakeUserProjectFeatureVariable()
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
    it('Should remove the feature from the cache\'s payload when it is disabled', async () => {
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


describe('RebuildBothCaches', () => {

    it('Should make a cache entry for a project with no features when its first feature is created', async () => {
        /* 
        * Since a project's information is not cached when it is created with no features
        * or variables, we need to be able to make sure that an empty project's information is 
        * cached when a new feature is created. 
        * 
        * We first create a user and an empty project. We then read the cache before a feature is created
        * to make sure that none of the new project's information has been cached. We then make a feature, 
        * read the cache again and ensure that the entries are not null. 
        */
        let {
            fakeUser, 
            fakeProject
        } = await makeUsernandProject(app, options.username, options.password, options.projectName)
        let [ 
            devCacheBeforeRebuild, 
            prodCacheBeforeRebuild 
        ]  = await getProjectsCacheEntries(fakeProject)
        await makeFeature({
            app, 
            fakeProject, 
            fakeUser, 
            projectName : fakeProject.state.name, 
            featureName : 'another-feature', 
            description : options.description, 
            initialVariableKey : options.initialVariableKey, 
            featureVariableName : options.featureVariableName,  
        }) 
        let [ 
            devCacheAfterRebuild, 
            prodCacheAfterRebuild 
        ] = await getProjectsCacheEntries(fakeProject)
        expect(devCacheBeforeRebuild).toBe(null) 
        expect(prodCacheBeforeRebuild).toBe(null) 
        expect(devCacheAfterRebuild).not.toBe(null) 
        expect(prodCacheAfterRebuild).not.toBe(null) 
    }) 
    it('Should update both caches to include a newly created variable', async () => {
        /* 
        * In order to test that both caches are rebuilt when a variable is created, 
        * we first need to create a user, project, and a feature. We then need to change 
        * the production and development status of the feature to true in order for 
        * us to be able to access the variables in the cache. We then take a snapshot
        * of the cache before make a new variable and a snapshot after and compare the results. 
        */
        let {
            fakeUser, 
            fakeProject, 
            fakeFeature, 
        } = await makeUserProjectAndFeature(options)
        await Promise.all([
            fakeFeature.ChangeProductionStatus(), 
            fakeFeature.ChangeDevelopmentStatus(), 
        ])
        let [ 
            devCacheBeforeRebuild, 
            prodCacheBeforeRebuild 
        ] = await getProjectsCacheEntries(fakeProject)
        let variableName = 'fake-variable' 
        await makeVariable({
            app, 
            fakeUser, 
            fakeFeature,
            fakeProject, 
            projectName : fakeProject.projectName, 
            newVariableName : variableName, 
        })
        let [ 
            devCacheAfterRebuild, 
            prodCacheAfterRebuild 
        ] = await getProjectsCacheEntries(fakeProject)
        expect(getVariableFromCache(devCacheBeforeRebuild, fakeFeature.featureName, variableName)).toBe(undefined)
        expect(getVariableFromCache(prodCacheBeforeRebuild, fakeFeature.featureName, variableName)).toBe(undefined)
        expect(getVariableFromCache(devCacheAfterRebuild, fakeFeature.featureName, variableName)).toBe(false)
        expect(getVariableFromCache(prodCacheAfterRebuild, fakeFeature.featureName, variableName)).toBe(false)
    })
    it('Should rebuild both caches when a feature is deleted', async () => {

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

describe('DestroyBothCaches', () => {
    /* 
    * The only admin operation that requires that both cache entries be deleted is 
    * when an admin decides to delete a project. Doing so causes the project and all
    * relevant data (features and variables) be deleted from the DB and the cache.  
    */
    it('Ensures that project cache entries are removed after a deleted project', async () => {
        /* 
        * Since project information is not stored in the cache when a project is created
        * without any features/variables, we have to create both a project and a feature
        * in order for the cache to be updated. We then read the state of the cache before 
        * and after the project is deleted and test the entries accordingly. 
        */ 
        let {
            fakeProject, 
        } = await makeUserProjectAndFeature(options)
        let developmentApiKey = fakeProject.developmentApiKey
        let productionApiKey = fakeProject.productionApiKey
        let [ 
            devCacheBeforeRebuild, 
            prodCacheBeforeRebuild 
        ] = await getProjectsCacheEntries(fakeProject)
        await fakeProject.DeleteFakeProject()
        let devCacheAfterRebuild = await readCache(developmentApiKey)
        let prodCacheAfterRebuild = await readCache(productionApiKey)
        expect(devCacheBeforeRebuild).not.toBe(null)
        expect(prodCacheBeforeRebuild).not.toBe(null)
        expect(devCacheAfterRebuild).toBe(null)
        expect(prodCacheAfterRebuild).toBe(null)
    })
})


describe('When cache is not rebuilt', () => {
    /* 
    * The only admin operation that doesn't require that the cache be rebuilt
    * is when a new project is created but there aren't features that have been 
    * created/assigned to that particular project yet
    */
    it('Creates a new project and does not cache any information about said project', async () => {
        /* 
        * This test first creates a new project and that attempts to read any cache entries
        * for its production and development api keys. Since no information is cached when a project
        * is created, both of these entries should return null. 
        */
        let { 
            fakeProject
        } = await makeUsernandProject(app, options.username, options.password, options.projectName)
        let developmentApiKey = fakeProject.state.developmentApiKey
        let productionApiKey = fakeProject.state.productionApiKey
        let developmentCacheState = await readCache(developmentApiKey)
        let productionCacheState = await readCache(productionApiKey)
        
        expect(developmentCacheState).toBe(null)
        expect(productionCacheState).toBe(null)
    })
})
