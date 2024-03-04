const Project = require('../../models/api/project');

function projectQuery(projectName, username) {
  return Project.findOne({
    $and: [{ name: projectName }, { owner: username }],
  });
}

async function queryByApiKey(apiKey) {
  return Project.findOne({
    $or: [{ productionApiKey: apiKey }, { developmentApiKey: apiKey }],
  });
}

async function queryAllUserProjects(username) {
  return Project.find({
    owner: username,
  });
}

async function queryMostRecentlyUpdatedProject(username) {
  return Project.findOne({
    owner: username,
  }).sort({
    updatedAt: -1,
  });
}

module.exports = {
  projectQuery,
  queryByApiKey,
  queryAllUserProjects,
  queryMostRecentlyUpdatedProject,
};
