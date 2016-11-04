const { combineReducers } = require('redux');
const credentialsReducer = require('./credentialsReducer');
const loginReducer = require('./loginReducer');
const signupReducer = require('./signupReducer');
const pageReducer = require('./pageReducer');

module.exports = combineReducers({
  credentials: credentialsReducer,
  login: loginReducer,
  signup: signupReducer,
  page: pageReducer,
});
