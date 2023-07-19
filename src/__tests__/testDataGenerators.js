const request = require('supertest')

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
        if (this.LoginFakeAccountResponse){ return }
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
    }

    async DeleteFakeProject () {
        const response = await request(this.app)
            .delete('/projects/delete-project')
            .set('Cookie', this.user.getFullCookie())
            .send({
                projectName : this.projectName
            })
        this.responses.DeleteFakeProject = response
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
        console.log(this.user.getFullCookie())
        this.responses.CreateFakeFeature = response
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
    }
}

class FakeVariable {
    constructor (app, user, project, feature, name, active, projectName){
        this.app = app
        this.user = user
        this.project = project
        this.feature = feature 
        this.name = name
        this.active = active
        this.projectName = projectName
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
        this.responses.DeleteFakeProject = response
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
    }
}

module.exports = {
    FakeUser, 
    FakeProject, 
    FakeFeature, 
    FakeVariable, 
}