const {
  QueryVariablesByUser,
} = require('../../../helpers/common-queries/variable-queries');
const {
  removeSensitiveVariableData,
} = require('./data-cleaners/cleaner-variables');

async function getVariables(req, res) {
  try {
    let { user } = req;
    let userVariables = await QueryVariablesByUser(user);
    let cleanedData = removeSensitiveVariableData(userVariables);
    res.json(cleanedData);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  getVariables,
};
