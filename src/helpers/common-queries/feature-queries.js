const Feature = require('../../models/api/feature');

function FeatureExistsQuery(name, username, projectName) {
  return Feature.findOne({
    $and: [
      { $and: [{ name }, { owner: username }] },
      { parentProjectName: projectName },
    ],
  });
}

function QueryProductionFeatures(apiKey) {
  return Feature.find({
    $and: [{ productionEnabled: true }, { productionApiKey: apiKey }],
  });
}

function QueryDevelopmentFeatures(apiKey) {
  return Feature.find({
    $and: [{ developmentEnabled: true }, { developmentApiKey: apiKey }],
  });
}

function QueryFeaturesByUser(username) {
  return Feature.find({
    owner: username,
  });
}

function QueryFeaturesByProject(projectName, username) {
  return Feature.find({
    $and: [{ parentProjectName: projectName }, { owner: username }],
  });
}

function QueryMostRecentlyUpdatedFeature(username) {
  return Feature.findOne({
    owner: username,
  }).sort({
    updatedAt: -1,
  });
}

module.exports = {
  FeatureExistsQuery,
  QueryProductionFeatures,
  QueryDevelopmentFeatures,
  QueryFeaturesByUser,
  QueryFeaturesByProject,
  QueryMostRecentlyUpdatedFeature,
};
