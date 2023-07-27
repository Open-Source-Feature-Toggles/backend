const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    clearDatabase
} = require('../../../test-helpers')
const {
    makeUsernandProject, 
    makeUserProjectFeatureandVariable, 
} = require('../../../testDataGenerators')
const Project = require('../../../../models/api/project')
const Feature = require('../../../../models/api/feature')
const Variable = require('../../../../models/api/variable')

let app, testProject, user  
const USERNAME = 'fakeuser' 
const PASSWORD = 'fakepassword'
const PROJECT_NAME = 'fakeproject'

beforeAll( async () => {
    app = await SetupTestEnv()
})

afterAll( async () => {
    await TakeDownTestEnv()
})

beforeEach( async () => {
    let { fakeProject, fakeUser } = await makeUsernandProject(app, USERNAME, PASSWORD, PROJECT_NAME)
    testProject = fakeProject
    user = fakeUser
})

afterEach( async () => {
    await clearDatabase()
})

describe('Tests MakeNewProject function in Project Controller', () => {

    describe('MakeNewProject - Success Cases', () => {

        it('Calls MakeNewProject and returns a 200 status', () => {
            let makeProjectResponse = testProject.retrieveResponse('CreateFakeProject')
            expect(makeProjectResponse.status).toBe(200)
        })
        it('Creates a project with the name fakeProject', async () => {
            let findProject = await Project.findOne({ name: PROJECT_NAME })
            expect(findProject).not.toBe(null)
        })
        it('Creates two projects with the same name but different owners', async () => {
            await makeUsernandProject(app, 'new-fake-user', PASSWORD, PROJECT_NAME)
            let allProjects = await Project.find()
            expect(allProjects.length).toBe(2)
            expect(allProjects[0].owner).not.toEqual(allProjects[1].owner)
            expect(allProjects[0].name).toEqual(allProjects[1].name)
        })
    })

    describe('MakeNewProject - Error Cases', () => {

        it('Tries to create a project with the same name/owner and returns a 409', async () => {
            let response = await testProject.CreateFakeProject()
            expect(response.status).toBe(409)
        })
    })
})

describe('Tests DeleteProject function in Project Controller', () => {

    describe('DeleteProject - Success Cases', () => {

        it('Calls DeleteProject and returns a 200 status', async () => {
            let response = await testProject.DeleteFakeProject()
            expect(response.status).toBe(200)
        })
        it('Deletes project from DB', async () => {
            let beforeDelete = await Project.findOne({ name : PROJECT_NAME })
            await testProject.DeleteFakeProject()
            let afterDelete = await Project.findOne({ name : PROJECT_NAME })
            expect(beforeDelete).not.toBe(null)
            expect(afterDelete).toBe(null)
        })
        it('Deletes all features and variables associated with the project', async () => {
            /* 
            * This test will create a new user with an associated project, 
            * feature, and variable. It will then call fakeProject.DeleteFakeProject(), 
            * which should delete all associated variables and features with the project. 
            * The test first asserts that they were created and then asserts that they have 
            * been deleted. 
            */
            await clearDatabase()
            let {
                fakeProject
            } = await makeUserProjectFeatureandVariable({
                app, 
                username : USERNAME, 
                password : PASSWORD, 
                projectName : PROJECT_NAME, 
                featureName : 'fake-feature', 
                description : 'fake-description', 
                initialVariableKey : 'fake-key', 
                featureVariableName : 'fake-name', 
                newVariableName : 'fake-variable', 
            })
            let featureBeforeDelete = await Feature.findOne({ parentProjectName : PROJECT_NAME })
            let variablesBeforeDelete = await Variable.findOne({ parentFeatureName : 'fake-feature' })
            let projectBeforeDelete = await Project.findOne({ name : PROJECT_NAME })
            await fakeProject.DeleteFakeProject()
            let featureAfterDelete = await Feature.findOne({ parentProjectName : PROJECT_NAME })
            let variablesAfterDelete = await Variable.findOne({ parentFeatureName : 'fake-feature' })
            let projectAfterDelete = await Project.findOne({ name : PROJECT_NAME })
            expect(projectBeforeDelete).not.toBe(null)
            expect(projectBeforeDelete.features[0]).toEqual(featureBeforeDelete._id)
            expect(featureBeforeDelete.variables.includes(variablesBeforeDelete._id)).toEqual(true)
            expect(projectAfterDelete).toBe(null)
            expect(featureAfterDelete).toBe(null)
            expect(variablesAfterDelete).toBe(null) 
        })
    })

    describe('DeleteProject - Error Cases', () => {

        it('Calls DeleteProject on a project that does not exist', async () => {
            /* 
            * In order to test that the 404 route works on the DeleteProject controller, 
            * we first delete it from the DB and then try to delete it again.  
            */
            await testProject.DeleteFakeProject()
            let response = await testProject.DeleteFakeProject()
            expect(response.status).toBe(404)
        })
    })
})