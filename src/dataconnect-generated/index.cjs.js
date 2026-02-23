const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'sc-ufrj',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const listActivitiesForEventDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListActivitiesForEventDay', inputVars);
}
listActivitiesForEventDayRef.operationName = 'ListActivitiesForEventDay';
exports.listActivitiesForEventDayRef = listActivitiesForEventDayRef;

exports.listActivitiesForEventDay = function listActivitiesForEventDay(dcOrVars, vars) {
  return executeQuery(listActivitiesForEventDayRef(dcOrVars, vars));
};

const registerUserForActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterUserForActivity', inputVars);
}
registerUserForActivityRef.operationName = 'RegisterUserForActivity';
exports.registerUserForActivityRef = registerUserForActivityRef;

exports.registerUserForActivity = function registerUserForActivity(dcOrVars, vars) {
  return executeMutation(registerUserForActivityRef(dcOrVars, vars));
};

const getUserProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserProfile');
}
getUserProfileRef.operationName = 'GetUserProfile';
exports.getUserProfileRef = getUserProfileRef;

exports.getUserProfile = function getUserProfile(dc) {
  return executeQuery(getUserProfileRef(dc));
};
