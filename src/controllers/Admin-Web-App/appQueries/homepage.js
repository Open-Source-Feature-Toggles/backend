const {
  queryMostRecentlyUpdatedProject,
} = require('../../../helpers/common-queries/project-queries');
const {
  QueryFeaturesByProject,
  QueryMostRecentlyUpdatedFeature,
} = require('../../../helpers/common-queries/feature-queries');
const {
  QueryVariablesByProject,
  QueryMostRecentlyUpdatedVariable,
} = require('../../../helpers/common-queries/variable-queries');
const {
  cleanHomePageData,
  returnMostRecentlyUpdated,
} = require('./data-cleaners/cleaner-homepage');

async function getHomePageData(req, res) {
  try {
    let { user } = req;
    let projectName = req.query.project_name;
    if (!projectName) {
      /* 

            If the application does not provide a specific project that it would
            like to query, this will go through all user documents (projects, variables, 
            and features) and will select the one that was most recently updated
            */
      let [project, feature, variable] = await Promise.all([
        queryMostRecentlyUpdatedProject(user),
        QueryMostRecentlyUpdatedFeature(user),
        QueryMostRecentlyUpdatedVariable(user),
      ]);
      projectName = returnMostRecentlyUpdated(project, feature, variable);
      if (!projectName) {
        return res.status(200).json({ noProjects: true });
      }
    }
    let [features, variables] = await Promise.all([
      QueryFeaturesByProject(projectName, user),
      QueryVariablesByProject(user, projectName),
    ]);
    let cleanedData = cleanHomePageData(projectName, features, variables);
    res.json(cleanedData);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  getHomePageData,
};
