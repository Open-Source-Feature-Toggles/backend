function FlattenFeatures (features_array) {
    return features_array.map( (feature, _)  => {
        return feature.variables
    }).flat()
}


function BuildPayload ( variables_array ) {
    let payload = { 
        'variables' : {}, 
        'last_updated' : new Date()
    }
    variables_array.forEach(variable => {
        if (payload['variables'][variable.parentFeatureName]) {
            payload['variables'][variable.parentFeatureName].push({ [variable.name]: variable.active });
        } else {
            payload['variables'][variable.parentFeatureName] = [{ [variable.name]: variable.active }];
        }
    })
    return payload
}

module.exports = {
    FlattenFeatures, 
    BuildPayload, 
}