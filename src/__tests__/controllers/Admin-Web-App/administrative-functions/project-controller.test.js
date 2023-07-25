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

        it('Calls /projects/make-new-project and returns a 200 status', () => {
            let makeProjectResponse = testProject.responses.CreateFakeProject
            expect(makeProjectResponse.status).toBe(200)
        })
        it('Creates a project with the name fakeProject', async () => {
            let findProject = await Project.findOne({ name: PROJECT_NAME })
            expect(findProject).not.toBe(null)
            expect(findProject.owner).toBe(USERNAME)
        })
        it('Creates two projects with the same name but different owners', async () => {
            let { fakeProject, fakeUser } = await makeUsernandProject(app, 'new-fake-user', PASSWORD, PROJECT_NAME)
            let allProjects = await Project.find()
            expect(allProjects.length).toBe(2)
            expect(allProjects[0].owner).not.toEqual(allProjects[1].owner)
            expect(allProjects[0].name).toEqual(allProjects[1].name)
        })
    })

    describe('MakeNewProject - Error Cases', () => {

        it('Tries to create a project with the same name and returns a 409', async () => {
            let createProjectResponse = await request(app)
                .post('/projects/make-new-project')
                .set('Cookie', user.getFullCookie())
                .send({
                    projectName : PROJECT_NAME, 
                })
            expect(createProjectResponse.status).toBe(409)
        })
    })
})

describe('Tests DeleteProject function in Project Controller', () => {

    describe('DeleteProject - Success Cases', () => {

        it('Calls /projects/delete-project and returns a 200 status', async () => {
            await testProject.DeleteFakeProject()
            let deleteProjectStatus = testProject.responses.DeleteFakeProject
            expect(deleteProjectStatus.status).toBe(200)
        })
        it('Deletes project from DB', async () => {
            let beforeDelete = await Project.findOne({ name : PROJECT_NAME })
            await testProject.DeleteFakeProject()
            let afterDelete = await Project.findOne({ name : PROJECT_NAME })
            expect(beforeDelete).not.toBe(null)
            expect(afterDelete).toBe(null)
        })
        it('Deletes all features and variables associated with the project', async () => {
            await clearDatabase()
            // This will make a new user, project, feature, and two new variables 
            // This way, we can check to make sure that all four items are deleted 
            // When a project is deleted
            let { 
                fakeProject, 
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
            let projectBeforeDelete = await Project.findOne({ name : PROJECT_NAME })
            let featureBeforeDelete = await Feature.findOne({ name : 'fake-feature' })
            let variablesBeforeDelete = await Variable.find({ owner : USERNAME })
            await fakeProject.DeleteFakeProject()
            let projectAfterDelete = await Project.findOne({ name : PROJECT_NAME })
            let featureAfterDelete = await Feature.findOne({ name : 'fake-feature' }) 
            let variablesAfterDelete = await Variable.find({ owner : USERNAME })
            expect(projectBeforeDelete).not.toBe(null)
            expect(projectBeforeDelete.features[0]).toEqual(featureBeforeDelete._id)
            expect(featureBeforeDelete.variables.length).toEqual(variablesBeforeDelete.length)
            expect(projectAfterDelete).toBe(null)
            expect(featureAfterDelete).toBe(null)
            expect(variablesAfterDelete.length).toBe(0)
        })
    })

    describe('DeleteProject - Error Cases', () => {

        it('Calls DeleteProject with an invalid Project Name and returns a 404', async () => {
            let badRequest = await request(app)
                .delete('/projects/delete-project')
                .set('Cookie', user.getFullCookie())
                .send({
                    projectName : 'bad-project-name', 
                })
            expect(badRequest.status).toBe(404)
        })
    })
})