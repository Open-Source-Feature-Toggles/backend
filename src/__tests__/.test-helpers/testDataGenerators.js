const request = require('supertest')
const User = require('../../models/auth/user')
const Project = require('../../models/api/project')
const Variable = require('../../models/api/variable')
const Feature = require('../../models/api/feature')

class FakeUser {
    constructor (app, username, password) {
        this.app = app
        this.username = username
        this.password = password 
        this.cookie 
        this.accessToken
        this.responses = {}
    }

    async createFakeAccount () {
        if (this.responses.LoginFakeAccountResponse){ return }
        const response = await request(this.app)
            .post('/auth/sign-up')
            .send({ 
                username : this.username, 
                password : this.password, 
                confirm_password : this.password 
        })
        this.accessToken = response.body.accessToken
        this.ParseCookie(response)
        this.responses.createFakeAccountResponse = response
        await this.UpdateUserState()
        return response
    }  

    async LoginFakeAccount () {
        const response = await request(this.app)
            .post('/auth/login')
            .send({ 
                username : this.username, 
                password : this.password,  
        })
        this.accessToken = response.body.accessToken
        this.ParseCookie(response)
        this.responses.LoginFakeAccountResponse = response
        await this.UpdateUserState()
        return response
    }
    
    async UpdateUserState () {
        this.state = await User.findOne({ username : this.username })
    }

    getFullCookie () {
        return this.cookie.full_cookie
    }

    ParseCookie (response_object) {
        let full_cookie = response_object.headers['set-cookie'][0].split(';')[0].split('=')
        let cookie_name = full_cookie[0]
        let jwt = full_cookie[1]
        full_cookie = `${cookie_name}=${jwt}`
        this.cookie = { full_cookie, cookie_name, jwt } 
    }

    retrieveResponse ( function_title ) {
        return this.responses[function_title]
    }
}

class FakeProject {
    constructor (app, user, projectName) {
        this.app = app
        this.projectName = projectName
        this.responses = {}
        this.user = user
    }

    async CreateFakeProject () {
        const response = await request(this.app)
            .post('/projects/make-new-project')
            .set('Cookie', this.user.getFullCookie())
            .send({
                projectName : this.projectName, 
            })
        this.responses.CreateFakeProject = response
        await this.UpdateProjectState()
        return response
    }

    async DeleteFakeProject () {
        const response = await request(this.app)
            .delete('/projects/delete-project')
            .set('Cookie', this.user.getFullCookie())
            .send({
                projectName : this.projectName
            })
        this.responses.DeleteFakeProject = response
        await this.UpdateProjectState()
        return response
    }

    async UpdateProjectState () {
        this.state = await Project.findOne({ name : this.projectName })
    }

    retrieveResponse ( function_title ) {
        return this.responses[function_title]
    }
}

class FakeFeature {
    constructor ( app, featureName, description, initialVariableKey, 
        projectName, featureVariableName, user=null, project=null ){
        this.app = app
        this.featureName = featureName 
        this.description = description
        this.initialVariableKey = initialVariableKey 
        this.projectName = projectName
        this.featureVariableName = featureVariableName
        this.responses = {}
        this.user = user
        this.project = project
    }

    async CreateFakeFeature () {
        const response = await request(this.app)
            .post('/features/make-new-feature')
            .set('Cookie', this.user.getFullCookie())
            .send({
                featureName : this.featureName, 
                description : this.description, 
                initialVariableKey : this.initialVariableKey, 
                projectName : this.projectName, 
                featureVariableName : this.featureVariableName, 
            })
        this.responses.CreateFakeFeature = response
        await this.UpdateFeatureState()
        return response
    }

    async ChangeProductionStatus() {
        const response = await request(this.app)
            .post('/features/change-production-status')
            .set('Cookie', this.user.getFullCookie())
            .send({
                featureName : this.featureName, 
                projectName : this.projectName, 
            })
        this.responses.ChangeProductionStatus = response
        await this.UpdateFeatureState()
        return response
    }

    async ChangeDevelopmentStatus () {
        const response = await request(this.app)
            .post('/features/change-development-status')
            .set('Cookie', this.user.getFullCookie())
            .send({
                featureName : this.featureName, 
                projectName : this.projectName, 
            })
        this.responses.ChangeDevelopmentStatus = response
        await this.UpdateFeatureState()
        return response
    }

    async DeleteFeature () {
        const response = await request(this.app)
            .delete('/features/delete-feature')
            .set('Cookie', this.user.getFullCookie())
            .send({
                featureName : this.featureName, 
                projectName : this.projectName, 
            })
        this.responses.DeleteFeature = response
        await this.UpdateFeatureState()
        return response            
    }

    async UpdateFeatureState () {
        this.state = await Feature.findOne({ name : this.featureName })
    }

    retrieveResponse ( function_title ) {
        return this.responses[function_title]
    }
}

class FakeVariable {
    constructor (app, user, project, feature, name, active){
        this.app = app
        this.user = user
        this.project = project
        this.feature = feature 
        this.name = name
        this.active = active
        this.projectName = this.project.projectName
        this.responses = {}
    }

    async CreateFakeVariable () {
        const response = await request(this.app)
            .post('/variables/make-new-variable')
            .set('Cookie', this.user.getFullCookie())
            .send({
                name : this.name, 
                active : this.active, 
                parentFeature : this.feature.featureName, 
                projectName : this.projectName
            })
        this.responses.CreateFakeVariable = response
        await this.UpdateVariableState()
        return response
    }

    async DeleteFakeVariable () {
        const response = await request(this.app)
            .delete('/variables/delete-variable')
            .set('Cookie', this.user.getFullCookie())
            .send({
                name : this.name,  
                parentFeature : this.feature.featureName, 
                projectName : this.projectName
            })
        this.responses.DeleteFakeVariable = response
        await this.UpdateVariableState()
        return response
    }

    async UpdateProductionStatus () {
        const response = await request(this.app)
            .post('/variables/update-production-status')
            .set('Cookie', this.user.getFullCookie())
            .send({
                name : this.name,  
                parentFeature : this.feature.featureName, 
                projectName : this.projectName
            })
        this.responses.UpdateProductionStatus = response
        await this.UpdateVariableState()
        return response
    }

    async UpdateDevelopmentStatus () {
        const response = await request(this.app)
            .post('/variables/update-development-status')
            .set('Cookie', this.user.getFullCookie())
            .send({
                name : this.name,  
                parentFeature : this.feature.featureName, 
                projectName : this.projectName
            })
        this.responses.UpdateDevelopmentStatus = response
        await this.UpdateVariableState()
        return response
    }

    async UpdateVariableState () {
        this.state = await Variable.findOne({ name : this.name })
    }


    retrieveResponse ( function_title ) {
        return this.responses[function_title]
    }
}

/* 
*
*   FACTORY FUNCTIONS 
*
*/

async function makeUser(app, username, password) {
    let fakeUser = new FakeUser(app, username, password)
    await fakeUser.createFakeAccount()
    return fakeUser 
}

/**
 * @param {Object} args - The options object
 * @param {Object} args.app - The app instance
 * @param {string} args.fakeUser - The instantiated fakeUser object
 * @param {string} args.fakeProject - The instantiated fakeProject object
 * @param {string} args.projectName - The name of the parentProject
 * @param {string} args.featureName - The name of the feature you want created
 * @param {string} args.description - The description of the feature you want created
 * @param {string} args.initialVariableKey - The name of the initial-variable-key you want created
 * @param {string} args.featureVariableName - The name of the feature variable
 */

async function makeFeature(args) {
    const { 
        app,
        fakeUser, 
        fakeProject,   
        projectName, 
        featureName, 
        description, 
        initialVariableKey, 
        featureVariableName 
    } = args 
    let fakeFeature = new FakeFeature(app, featureName, description, initialVariableKey, projectName, featureVariableName, fakeUser, fakeProject)
    await fakeFeature.CreateFakeFeature()
    return fakeFeature
}

/**
 * @param {Object} args - The options object
 * @param {Object} args.app - The app instance
 * @param {string} args.fakeUser - The instantiated fakeUser object
 * @param {string} args.fakeProject - The instantiated fakeProject object
 * @param {string} args.fakeFeature - The instantiated fakeFeature object
 * @param {string} args.projectName - The name of the parentProject
 * @param {string} args.newVariableName - The name of the variable you want created
 */

async function makeVariable(args) {
    const {
        app, 
        fakeUser, 
        fakeProject, 
        fakeFeature, 
        newVariableName,
    } = args
    let fakeVariable = new FakeVariable(app, fakeUser, fakeProject, fakeFeature, newVariableName, false, fakeProject.projectName )
    let createFakeVariableResponse = await fakeVariable.CreateFakeVariable()
    return { fakeVariable, createFakeVariableResponse } 
}

async function makeUsernandProject (app, username, password, projectName) {
    let fakeUser = await makeUser(app, username, password)
    let fakeProject = new FakeProject(app, fakeUser, projectName)
    let createFakeProjectResponse = await fakeProject.CreateFakeProject()
    return { fakeUser, fakeProject, createFakeProjectResponse }
}

/**
 * @param {Object} args - The options object
 * @param {Object} args.app - The app instance
 * @param {string} args.username - The username
 * @param {string} args.password - The password
 * @param {string} args.projectName - The project name
 * @param {string} args.featureName - The feature name
 * @param {string} args.description - The description
 * @param {string} args.initialVariableKey - The initial variable key
 * @param {string} args.featureVariableName - The feature variable name
 */

async function makeUserProjectAndFeature(args) {
    const { 
        app, 
        username, 
        password, 
        projectName, 
        featureName, 
        description, 
        initialVariableKey, 
        featureVariableName 
    } = args
    let { fakeUser, fakeProject } = await makeUsernandProject(app,
        username, password, projectName)
    let fakeFeature = new FakeFeature(app, featureName, description, initialVariableKey, projectName, featureVariableName, fakeUser, fakeProject)
    let createFakeFeatureResponse = await fakeFeature.CreateFakeFeature()
    return { fakeUser, fakeProject, fakeFeature, createFakeFeatureResponse }
}

/**
 * @param {Object} args - The options object
 * @param {Object} args.app - The app instance
 * @param {string} args.username - The username
 * @param {string} args.password - The password
 * @param {string} args.projectName - The project name
 * @param {string} args.featureName - The feature name
 * @param {string} args.description - The description
 * @param {string} args.initialVariableKey - The initial variable key
 * @param {string} args.featureVariableName - The feature variable name
 * @param {string} args.newVariableName - The new variable name
 */

async function makeUserProjectFeatureandVariable (args) {
    const { 
        app, 
        username, 
        password, 
        projectName, 
        featureName, 
        description, 
        initialVariableKey, 
        featureVariableName,
        newVariableName, 
    } = args
    let { fakeUser, fakeProject, fakeFeature } = await makeUserProjectAndFeature({
        app, username, password, projectName, featureName, description, 
        initialVariableKey, featureVariableName
    })
    let fakeVariable = new FakeVariable(app, fakeUser, fakeProject, fakeFeature, newVariableName, false, projectName )
    let createFakeVariableResponse = await fakeVariable.CreateFakeVariable()
    return { fakeUser, fakeProject, fakeFeature, fakeVariable, createFakeVariableResponse }
}

module.exports = {
    FakeUser, 
    FakeProject, 
    FakeFeature, 
    FakeVariable,
    makeUser, 
    makeVariable, 
    makeFeature, 
    makeUsernandProject, 
    makeUserProjectAndFeature, 
    makeUserProjectFeatureandVariable 
}