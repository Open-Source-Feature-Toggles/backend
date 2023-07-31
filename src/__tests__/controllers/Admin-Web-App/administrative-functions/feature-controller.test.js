const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    clearDatabase
} = require('../../../.test-helpers/general-helpers')
const {
    makeVariable, 
    makeUserProjectAndFeature, 
} = require('../../../.test-helpers/testDataGenerators')
const Feature = require('../../../../models/api/feature')
const Project = require('../../../../models/api/project')
const Variable = require('../../../../models/api/variable')

let app, goodOptions 
const USERNAME = 'fakeuser' 
const PASSWORD = 'fakepassword'

beforeAll( async () => {
    jest.setTimeout(600000)
    app = await SetupTestEnv()
    goodOptions = {
        app,  
        username : USERNAME, 
        password : PASSWORD, 
        projectName : 'fake-project', 
        featureName : 'fake-feature', 
        description : 'a-feature', 
        initialVariableKey : 'a-variable', 
        featureVariableName : 'a-variable', 
    }
})

afterAll( async () => {
    await TakeDownTestEnv()
})


let user, project, feature 
beforeEach( async () => {
    const {fakeUser, fakeProject, fakeFeature} = await makeUserProjectAndFeature(goodOptions)
    user = fakeUser 
    project = fakeProject
    feature = fakeFeature
})

afterEach( async () => {
    await clearDatabase()
})


describe('Tests ChangeProductionStatus function in Feature Controller', () => {

    describe('ChangeProductionStatus - Success Cases', () => {

        it('Calls ChangeProductionStatus and returns a 200', async () => {
            let response = await feature.ChangeProductionStatus()
            expect(response.status).toBe(200)
        })
    
        it('Checks that feature.productionEnabled was changed to true', async () => {
            let beforeChange = await Feature.findOne({ name : goodOptions.featureName }) 
            await feature.ChangeProductionStatus()
            let afterChange = await Feature.findOne({ name : goodOptions.featureName }) 
            expect(beforeChange.productionEnabled).toBe(false)
            expect(afterChange.productionEnabled).toBe(true)
        })    
    })
    
    describe('ChangeProductionStatus - Error Cases', () => {

        it('Calls ChangeProductionStatus on a nonexistent feature and returns a 404', async () => {
            await feature.DeleteFeature()
            let response = await feature.ChangeProductionStatus()
            expect(response.status).toBe(404)
        })
    })
})


describe('Tests ChangeDevelopmentStatus function in Feature Controller', () => {

    describe('ChangeDevelopmentStatus - Success Cases', () => {

        it('Calls ChangeDevelopmentStatus and returns a 200', async () => {
            let response = await feature.ChangeDevelopmentStatus()
            expect(response.status).toBe(200)
        })
        it('Checks that feature.developmentEnabled was changed to true', async () => {
            let beforeChange = await Feature.findOne({ name : goodOptions.featureName }) 
            await feature.ChangeDevelopmentStatus()
            let afterChange = await Feature.findOne({ name : goodOptions.featureName }) 
            expect(beforeChange.developmentEnabled).toBe(false)
            expect(afterChange.developmentEnabled).toBe(true)
        })
    })

    describe('ChangeDevelopmentStatus - Error Cases', () => {

        it('It calls ChangeDevelopmentStatus on a nonexistent feature and returns a 404', async () => {
            await feature.DeleteFeature()
            let response = await feature.ChangeDevelopmentStatus()
            expect(response.status).toBe(404)
        })
    })
})

describe('Tests DeleteFeature function in Feature Controller', () => {

    describe('DeleteFeature - Success Cases', () => {

        it('Successfully calls DeleteFeature and returns a 200', async () => {
            let response = await feature.DeleteFeature()
            expect(response.status).toBe(200)
        })
        it('Successfully deletes a feature', async () => {
            let beforeChange = await Feature.findOne({ name : goodOptions.featureName })
            await feature.DeleteFeature()
            let afterChange = await Feature.findOne({ name : goodOptions.featureName })
            expect(beforeChange).not.toBe(null)
            expect(afterChange).toBe(null)
        })
        it('Successfully removes feature from the project\'s feature array', async () => {
            /* 
            * We first need to get the id of the feature we'll be testing
            * We then query the project before we delete the feature to make
            * sure it lists the feature as one of its children. 
            * We then perform the delete and repeat the last two steps to ensure 
            * the feature was removed from the project's array 
            */  
            let featureID = (await Feature.findOne({ name : goodOptions.featureName }))._id
            let projectBeforeDelete = await Project.findOne({ name : goodOptions.projectName })
            let isFeatureIdinProjectArray = projectBeforeDelete.features.includes(featureID)
            await feature.DeleteFeature()
            let projectAfterDelete = await Project.findOne({ name : goodOptions.projectName })
            let isFeatureIdNotInProjectArray = projectAfterDelete.features.includes(featureID)
            expect(isFeatureIdinProjectArray).toBe(true)
            expect(isFeatureIdNotInProjectArray).toBe(false)
        })
        it('Successfully deletes all of the feature\'s children variables', async () => {
            /* 
            * We first make a new variable, so that there are two variables  
            * in the feature's array. This is done to test that all of a 
            * feature's variables are deleted, not just one. 
            */
            await makeVariable({
                app : app, 
                fakeUser : user, 
                fakeProject : project, 
                fakeFeature : feature, 
                projectName : goodOptions.projectName, 
                newVariableName : 'newVariable'
            })
            let childVariableBeforeDelete = await Variable.find({ parentFeatureName : goodOptions.featureName})
            await feature.DeleteFeature()
            let childVariableAfterDelete = await Variable.find({ parentFeatureName : goodOptions.featureName})
            expect(childVariableBeforeDelete.length).toBe(2)
            expect(childVariableAfterDelete.length).toBe(0)
        })

    })

    describe('DeleteFeature - Error Cases', () => {

        it('Calls DeleteFeature on a nonexistent feature and returns a 404', async () => {
            /* 
            * We first successfully delete the feature, so when we try a second time
            * It mimics trying to delete a feature that DNE 
            */
            await feature.DeleteFeature()
            let response = await feature.DeleteFeature()
            expect(response.status).toBe(404)
        })
        it('Calls DeleteFeature on a nonexistent project and returns a 404', async () => {
            /* 
            * First delete the project so that the controller isn't able to find a 
            * a valid project associated with the given variable 
            */
            await project.DeleteFakeProject()
            let response = await feature.DeleteFeature()
            expect(response.status).toBe(404)
        })
    })
})

describe('Tests MakeNewFeature function in Feature Controller', () => {

    describe('MakeNewFeature - Success Cases', () => {

        it('Calls MakeNewFeature and returns a status of 200', async () => {
            let response = feature.retrieveResponse('CreateFakeFeature')
            expect(response.status).toBe(200)
        })
        it('Successfully creates a new feature', async () => {
            let findFeature = await Feature.findOne({ name : goodOptions.featureName })
            expect(findFeature).not.toBe(null)
        })
        it('Successfully creates a child variable and adds it ', async () => {
            let [findChildVariable, findFeature ] = await Promise.all([
                Variable.findOne({ parentFeatureName : goodOptions.featureName }), 
                Feature.findOne({ name : goodOptions.featureName })
            ]) 
            let variableID = findChildVariable._id
            expect(findFeature.variables.includes(variableID)).toBe(true)
        })
        it('Successfully adds new feature\'s id to project\'s feature array', async () => {
            let [ findFeature, findParentProject ] = await Promise.all([
                Feature.findOne({ name: goodOptions.featureName }), 
                Project.findOne({ name : goodOptions.projectName })
            ])
            let featureID = findFeature._id
            expect(findParentProject.features.includes(featureID)).toBe(true)
        })
    })

    describe('MakeNewFeature - Error Cases', () => {

        it('Tries to create a feature with a name/owner that already exists and returns a 409', async () => {
            /* 
            * At the beginning of the script, we call CreateFakeFeature with
            * a feature name that's taken from the goodOptions object. Here, 
            * we try to create the same feature again with the same options (same owner, project,
            * and feature name) as the one that was initially created. 
            */ 
            let response = await feature.CreateFakeFeature()
            expect(response.status).toBe(409)
        })
        it('Tries to create a feature for a nonexistent project', async () => {
            /* 
            * We first call DeleteFakeProject on our project that was created before 
            * this test. When we make a call to the DeleteProject controller, we 
            * delete all of the associated variables and features with that project
            * along with the project itself. This is done in the beginning of the test
            * so that when we call CreateFakeFeature, the controller is unable to find
            * a feature that exists with that name (which is what we want for this test),
            * but is unable to find a project with the given name/owner, which is what
            * this is testing. 
            */
            await Promise.all([
                project.DeleteFakeProject(), 
            ])
            let response = await feature.CreateFakeFeature()
            expect(response.status).toBe(404)
        })  
    })
})