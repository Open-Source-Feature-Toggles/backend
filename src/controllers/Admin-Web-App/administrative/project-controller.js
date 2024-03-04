const Project = require('../../../models/api/project');
const Feature = require('../../../models/api/feature');
const Variable = require('../../../models/api/variable');
const {
  ResourceNotFoundError,
  NameAlreadyExistsError,
} = require('../../../helpers/common-error-messages');
const {
  projectValidation,
} = require('../../../validations/project-validaters');
const { generateApiKeys } = require('../../../helpers/Api-Key-Helpers');
const {
  projectQuery,
} = require('../../../helpers/common-queries/project-queries');

async function MakeNewProject(req, res) {
  try {
    let { projectName } = req.body;
    let projectExists = await projectQuery(projectName, req.user);
    if (projectExists) {
      return NameAlreadyExistsError(res, 'Project');
    }
    let [productionApiKey, developmentApiKey] = await generateApiKeys();
    let newProject = new Project({
      name: projectName,
      features: [],
      owner: req.user,
      created: new Date(),
      productionApiKey,
      developmentApiKey,
    });
    await newProject.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function DeleteProject(req, res, next) {
  try {
    let { projectName } = req.body;
    let project = await projectQuery(projectName, req.user);
    if (!project) {
      return ResourceNotFoundError(res, 'Project');
    }
    await Promise.all([
      Variable.deleteMany({ parentFeatureID: { $in: project.features } }),
      Feature.deleteMany({ parentProjectID: project._id }),
      Project.findByIdAndDelete(project._id),
    ]);
    res.status(200).json({ success: true });
    req.productionApiKey = project.productionApiKey;
    req.developmentApiKey = project.developmentApiKey;
    return next();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

exports.POST_make_new_project = [projectValidation, MakeNewProject];

exports.DELETE_delete_project = [projectValidation, DeleteProject];
