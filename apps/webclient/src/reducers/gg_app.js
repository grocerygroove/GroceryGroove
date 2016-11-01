const { combineReducers } = require('redux');
const credentialsReducer = require('./credentialsReducer');
const loginReducer = require('./loginReducer');
const signupReducer = require('./signupReducer');

module.exports = combineReducers({
  credentials: credentialsReducer,
  login: loginReducer,
  signup: signupReducer,
});
