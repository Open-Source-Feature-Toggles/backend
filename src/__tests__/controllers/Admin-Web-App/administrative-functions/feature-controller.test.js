const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    clearDatabase
} = require('../../../test-helpers')
const {
    makeVariable, 
    makeUserProjectAndFeature, 
    makeUser, 
} = require('../../../testDataGenerators')
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

        it('Successfully calls /features/change-production-status and returns a 200', async () => {
            await feature.ChangeProductionStatus()
            let changeProductionResponse = feature.responses.ChangeProductionStatus
            expect(changeProductionResponse.status).toBe(200)
        })
    
        it('Correctly changes productionEnabled on feature to true', async () => {
            let beforeChange = await Feature.findOne({ name : goodOptions.featureName }) 
            await feature.ChangeProductionStatus()
            let afterChange = await Feature.findOne({ name : goodOptions.featureName }) 
            expect(beforeChange.productionEnabled).toBe(false)
            expect(afterChange.productionEnabled).toBe(true)
        })    
    })
    
    describe('ChangeProductionStatus - Error Cases', () => {

        it('It calls ChangeProductionStatus with an incorrect feature name and returns a 404', async () => {
            let response = await request(app)
                .post('/features/change-production-status')
                .set('Cookie', user.getFullCookie())
                .send({
                    featureName : 'wrong-name', 
                    projectName : goodOptions.projectName
                })
            expect(response.status).toBe(404)
        })
        it('It calls ChangeProductionStatus with an incorrect project name and returns a 404', async () => {
            let response = await request(app)
                .post('/features/change-production-status')
                .set('Cookie', user.getFullCookie())
                .send({
                    featureName : goodOptions.featureName, 
                    projectName : 'wrong-name'
                })
            expect(response.status).toBe(404)
        })
    })
})


describe('Tests ChangeDevelopmentStatus function in Feature Controller', () => {

    describe('ChangeDevelopmentStatus - Success Cases', () => {

        it('Successfully calls /features/change-development-status and returns a 200', async () => {
            await feature.ChangeDevelopmentStatus()
            let changeDevelopmentResponse = feature.responses.ChangeDevelopmentStatus
            expect(changeDevelopmentResponse.status).toBe(200)
        })
        it('Correctly changes developmentEnabled on feature to true', async () => {
            let beforeChange = await Feature.findOne({ name : goodOptions.featureName }) 
            await feature.ChangeDevelopmentStatus()
            let afterChange = await Feature.findOne({ name : goodOptions.featureName }) 
            expect(beforeChange.developmentEnabled).toBe(false)
            expect(afterChange.developmentEnabled).toBe(true)
        })
    })

    describe('ChangeDevelopmentStatus - Error Cases', () => {

        it('It calls ChangeDevelopmentStatus with an incorrect feature name and returns a 404', async () => {
            let response = await request(app)
                .post('/features/change-development-status')
                .set('Cookie', user.getFullCookie())
                .send({
                    featureName : 'wrong-name', 
                    projectName : goodOptions.projectName
                })
            expect(response.status).toBe(404)
        })
        it('It calls ChangeProductionStatus with an incorrect project name and returns a 404', async () => {
            let response = await request(app)
                .post('/features/change-development-status')
                .set('Cookie', user.getFullCookie())
                .send({
                    featureName : goodOptions.featureName, 
                    projectName : 'wrong-name'
                })
            expect(response.status).toBe(404)
        })
    })
})

describe('Tests DeleteFeature function in Feature Controller', () => {

    describe('DeleteFeature - Success Cases', () => {

        it('Successfully calls features/delete-feature and returns a 200', async () => {
            await feature.DeleteFeature()
            let deleteFeatureResponse = feature.responses.DeleteFeature
            expect(deleteFeatureResponse.status).toBe(200)
        })
        it('Successfully deletes a feature', async () => {
            let beforeChange = await Feature.findOne({ name : goodOptions.featureName })
            await feature.DeleteFeature()
            let afterChange = await Feature.findOne({ name : goodOptions.featureName })
            expect(beforeChange).not.toBe(null)
            expect(afterChange).toBe(null)
        })
        it('Successfully removes feature from the project\'s feature array', async () => {
            let getFeature = await Feature.findOne({ name : goodOptions.featureName })
            let projectBeforeDelete = await Project.findOne({ name : goodOptions.projectName })
            let isFeatureIdinProjectArray = projectBeforeDelete.features.includes(getFeature._id)
            await feature.DeleteFeature()
            let projectAfterDelete = await Project.findOne({ name : goodOptions.projectName })
            let isFeatureIdNotInProjectArray = projectAfterDelete.features.includes(getFeature._id)
            expect(isFeatureIdinProjectArray).toBe(true)
            expect(isFeatureIdNotInProjectArray).toBe(false)
        })
        it('Successfully deletes all of the feature\'s children variables', async () => {
            let newVariable = await makeVariable({
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

        it('Attempts to call DeleteFeature on a nonexistent feature and returns a 404', async () => {
            let response = await request(app)
                .delete('/features/delete-feature')
                .set('Cookie', user.getFullCookie())
                .send({
                    featureName : 'incorrect-name', 
                    projectName : goodOptions.projectName, 
                })
            expect(response.status).toBe(404)
        })
        it('Attempts to call DeleteFeature on a feature with a nonexistent project and returns a 404', async () => {
            let response = await request(app)
                .delete('/features/delete-feature')
                .set('Cookie', user.getFullCookie())
                .send({
                    featureName : goodOptions.featureName, 
                    projectName : 'incorrect-name', 
                })
            expect(response.status).toBe(404)
        })
    })
})

describe('Tests MakeNewFeature function in Feature Controller', () => {

    // This particular block is testing to see if we can create 
    // a user, and therefore needs to start with no data 
    beforeEach( async () => {
        await clearDatabase()
    })

    describe('MakeNewFeature - Success Cases', () => {

        it('Calls /features/make-new-feature and returns a status of 200', async () => {
            let { fakeFeature }  = await makeUserProjectAndFeature(goodOptions)
            let createNewFeatureStatus = fakeFeature.responses.CreateFakeFeature
            expect(createNewFeatureStatus.status).toBe(200) 
        })
        it('Successfully creates a new feature', async () => {
            let numFeaturesBeforeCreation = await Feature.find()
            let { fakeFeature } = await makeUserProjectAndFeature(goodOptions)
            let numFeaturesAfterCreation = await Feature.find()
            expect(numFeaturesBeforeCreation.length).toBe(0)
            expect(numFeaturesAfterCreation.length).toBe(1)
        })
        it('Successfully creates a child variable by default', async () => {
            let { fakeFeature } = await makeUserProjectAndFeature(goodOptions)
            let findChildVariable = await Variable.findOne({ name: goodOptions.featureVariableName })
            expect(findChildVariable).not.toBe(null)
        })
        it('Successfully adds new feature\'s id to project\'s feature array', async () => {
            let { fakeFeature } = await makeUserProjectAndFeature(goodOptions)
            let findFeature = await Feature.findOne({ name: goodOptions.featureName })
            let findProject = await Project.findOne({ name : goodOptions.projectName })
            let featureIdFromProjectArray = findProject.features[0]
            expect(findProject.features.length).toBe(1)
            expect(featureIdFromProjectArray).toEqual(findFeature._id)
        })
    })

    describe('MakeNewFeature - Error Cases', () => {

        it('Tries to create a feature with the same name as an existing feature on the same project', async () => {
            let { fakeFeature, fakeUser } = await makeUserProjectAndFeature(goodOptions)
            let makeNewFeatureResponse = await request(app)
                .post('/features/make-new-feature')
                .set('Cookie', fakeUser.getFullCookie())
                .send({
                    featureName : goodOptions.featureName, 
                    description : 'some-description', 
                    initialVariableKey : goodOptions.initialVariableKey, 
                    featureVariableName : goodOptions.featureVariableName, 
                    projectName: goodOptions.projectName
                })
            expect(makeNewFeatureResponse.status).toBe(409)
        })
        // it('Tries to create a feature for a nonexistent project', async () => {
        //     let { fakeUser } = await makeUser(app, USERNAME, PASSWORD) 
        //     let makeNewFeatureResponse = await request(app)
        //         .post('/features/make-new-feature')
        //         .set('Cookie', fakeUser.getFullCookie())
        //         .send({
        //             featureName : goodOptions.featureName, 
        //             description : 'some-description', 
        //             initialVariableKey : goodOptions.initialVariableKey, 
        //             featureVariableName : goodOptions.featureVariableName, 
        //             projectName: 'not-an-actual-project'
        //         })         
        //     expect(makeNewFeatureResponse.status).toBe(409)
        // }) 
        //          This doesnt work ^^ 
    })
})