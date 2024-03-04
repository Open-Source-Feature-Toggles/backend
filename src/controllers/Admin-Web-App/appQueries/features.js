const {
  QueryFeaturesByUser,
} = require('../../../helpers/common-queries/feature-queries');
const {
  QueryFeaturesByProject,
} = require('../../../helpers/common-queries/feature-queries');
const {
  returnFeatureNames,
  removeSensitiveFeatureData,
} = require('./data-cleaners/cleaner-features');

async function getUserFeatures(req, res) {
  try {
    let { user } = req;
    let userFeatures = await QueryFeaturesByUser(user);
    let cleaned_data = removeSensitiveFeatureData(userFeatures);
    res.json(cleaned_data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function GetFeaturesByProjectName(req, res) {
  try {
    let { user } = req;
    let projectName = req.query.project_name;
    let features = await QueryFeaturesByProject(projectName, user);
    let getNames = returnFeatureNames(features);
    res.json(getNames);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  getUserFeatures,
  GetFeaturesByProjectName,
};
