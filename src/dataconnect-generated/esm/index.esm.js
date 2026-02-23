import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'sc-ufrj',
  location: 'southamerica-east1'
};

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const listActivitiesForEventDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListActivitiesForEventDay', inputVars);
}
listActivitiesForEventDayRef.operationName = 'ListActivitiesForEventDay';

export function listActivitiesForEventDay(dcOrVars, vars) {
  return executeQuery(listActivitiesForEventDayRef(dcOrVars, vars));
}

export const registerUserForActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterUserForActivity', inputVars);
}
registerUserForActivityRef.operationName = 'RegisterUserForActivity';

export function registerUserForActivity(dcOrVars, vars) {
  return executeMutation(registerUserForActivityRef(dcOrVars, vars));
}

export const getUserProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserProfile');
}
getUserProfileRef.operationName = 'GetUserProfile';

export function getUserProfile(dc) {
  return executeQuery(getUserProfileRef(dc));
}

