const Feature = require('../models/feature')
const Variable = require("../models/variable")


exports.GET_all_projects = async function (req, res) {
    
}



exports.POST_make_new_feature = async function (req, res) {
    // This function does not sanitize or validate form inoput
    // but it definitely should! 
    
    let { featureName, 
          featureKey, 
          description, 
          initialVariableKey 
        } = req.body

    let newFeature = new Feature({
        name: featureName, 
        description, 
        developmentEnabled: false, 
        productionEnabled : false, 
    })

    let newVariable = new Variable({
        name: initialVariableKey, 
        active : false, 
    })
    
    newFeature.variables = [ newVariable._id ]
    newVariable.parentFeature = newFeature._id

    try {
        await newFeature.save()
        await newVariable.save()
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }   
}