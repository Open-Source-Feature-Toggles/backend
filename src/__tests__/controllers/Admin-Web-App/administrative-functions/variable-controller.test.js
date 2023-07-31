const request = require('supertest')
const { 
    SetupTestEnv, 
    TakeDownTestEnv, 
    clearDatabase
} = require('../../../test-helpers')
const {
    makeUserProjectFeatureandVariable, 
    makeVariable, 
} = require('../../../testDataGenerators')

const Project = require('../../../../models/api/project')
const Feature = require('../../../../models/api/feature')
const Variable = require('../../../../models/api/variable')

let app, user, project, feature, variable, options  

beforeAll( async () => {
    app = await SetupTestEnv()
})

afterAll( async () => {
    await TakeDownTestEnv()
})

beforeEach( async () => {
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
    let { 
        fakeUser, 
        fakeProject, 
        fakeFeature, 
        fakeVariable
    } = await makeUserProjectFeatureandVariable(options)
    user = fakeUser, 
    project = fakeProject, 
    feature = fakeFeature, 
    variable = fakeVariable
})

afterEach( async () => {
    await clearDatabase()
})

describe('Tests MakeNewVariable in Variable Controller', () => {

    describe('MakeNewVariable - Success Cases', () => {

        it('Calls MakeNewVariable and returns a 200 status', () => {
            let response = variable.retrieveResponse('CreateFakeVariable')
            expect(response.status).toBe(200)
        })
        it('Creates a new variable with given variable name', async () => {
            let findVariable = await Variable.findOne({ name: options.newVariableName })
            expect(findVariable).not.toBe(null)
        })
        it('Places newly created variable inside of parent feature\'s variable array', async () => {
            let feature = await Feature.findOne({ name : options.featureName })
            let variableID = (await Variable.findOne({ name: options.newVariableName }))._id
            expect(feature.variables.includes(variableID)).toBe(true)
        })
    })

    describe('MakeNewVariable - Error Cases', () => {
        
        it('Attempts to make a variable with a name that\'s already held by an existing variable', async () => {
            /* 
            * By calling variable.CreateFakeVariable(), we are attempting to create 
            * a variable with the same name, owner, parentFeatureName, etc. that we 
            * used when creating the variable in the beforeEach block. This will 
            * inherently cause a conflict with our controller. 
            */
            let response = await variable.CreateFakeVariable()
            expect(response.status).toBe(409)
        })
        it('Attemps to make a variable for a feature that doesn\'t exist and returns a 404', async () => {
            /* 
            * By calling DeleteFeature, we will delete the feature + all child
            * variables associated with the feature. Since the MakeNewVariable 
            * function checks for two conditions (that there isn't already a variable
            * with the given name and that the parent Feature exists), this works well
            * for our test given we are testing the second condition.  
            */
            await feature.DeleteFeature()
            let response = await variable.CreateFakeVariable()
            expect(response.status).toBe(404)
        })
    })
})


describe('Tests DeleteVariable in Variable Controller', () => {

    describe('DeleteVariable - Success Cases', () => {

        let deletedVariableID 
        beforeEach( async () => {
            deletedVariableID = (await Variable.findOne({ name : options.newVariableName }))._id
            await variable.DeleteFakeVariable()
        })

        it('Calls DeleteVariable and returns a 200 status', async () => {
            let response = variable.retrieveResponse('DeleteFakeVariable')
            expect(response.status).toBe(200)
        })
        it('Successfully deletes a variable after DeleteVariable is called', async () => {
            let checkIfVariableDeleted = await Variable.findOne({ name: options.newVariableName })
            expect(checkIfVariableDeleted).toBe(null)
        })
        it('Successfully removes variable from parent feature array', async () => {
            let parentFeature = await Feature.findOne({ name : options.featureName })
            expect(parentFeature.variables.includes(deletedVariableID)).toBe(false)
        })
    })

    describe('DeleteVariable - Error Cases', () => {

        it('Attempts to delete a variable that doesn\'t exist and returns a 404', async () => {
            /* 
            * We first call DeleteFakeVariable() to successfully delete the variable
            * so that our second call to DeleteFakeVariable will fail (since the variable
            * no longer exists). 
            */
            await variable.DeleteFakeVariable()
            let response = await variable.DeleteFakeVariable()
            expect(response.status).toBe(404)
        })  
        it('Attemps to delete a variable from a parent feature that doesn\'t exist and returns a 404', async () => {
            /* 
            * First delete variable's parent feature, then try to delete variable, 
            * causing the controller to return a 404 
            */
            let getParentFeature = await Feature.findOne({ name : options.featureName })
            await Feature.findByIdAndDelete(getParentFeature._id)
            await variable.DeleteFakeVariable()
            let response = variable.retrieveResponse('DeleteFakeVariable') 
            expect(response.status).toBe(404)
        })
    })
})  


describe('Tests UpdateProductionStatus in Variable Controller', () => {

    describe('UpdateProductionStatus - Success Cases', () => {

        it('Calls UpdateProductionStatus and returns a 200 status', async () => {
            let response = await variable.UpdateProductionStatus()
            expect(response.status).toBe(200)
        })
        it('Checks to see that the production status was updated', async () => {
            let beforeUpdate = await Variable.findOne({ name : options.newVariableName })
            await variable.UpdateProductionStatus()
            let afterUpdate = await Variable.findOne({ name : options.newVariableName })
            expect(beforeUpdate.productionEnabled).toBe(false)
            expect(afterUpdate.productionEnabled).toBe(true)
        })
    })

    describe('UpdateProductionStatus - Error Cases', () => {

        it('Tries calling UpdateProductionStatus on a variable that DNE', async () => {
            await variable.DeleteFakeVariable()
            let response = await variable.UpdateProductionStatus()
            expect(response.status).toBe(404)
        })
    })
})


describe('Tests UpdateDevelopmentStatus in Variable Controller', () => {

    describe('UpdateDevelopmentStatus - Success Cases', () => {

        it('Calls UpdateDevelopmentStatus and returns a 200 status', async () => {
            let response = await variable.UpdateDevelopmentStatus()
            expect(response.status).toBe(200)
        })
        it('Checks to see that the development status was updated', async () => {
            let beforeUpdate = await Variable.findOne({ name : options.newVariableName })
            await variable.UpdateDevelopmentStatus()
            let afterUpdate = await Variable.findOne({ name : options.newVariableName })
            expect(beforeUpdate.developmentEnabled).toBe(false)
            expect(afterUpdate.developmentEnabled).toBe(true)
        })
    })

    describe('UpdateDevelopmentStatus - Error Cases', () => {

        it('Tries calling UpdateDevelopmentStatus on a variable that DNE', async () => {
            await variable.DeleteFakeVariable()
            let response = await variable.UpdateDevelopmentStatus()
            expect(response.status).toBe(404)
        })
    })
})