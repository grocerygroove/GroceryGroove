const { combineReducers } = require('redux-immutable');
const credentialsReducer = require('./credentialsReducer');
const loginReducer = require('./loginReducer');
const signupReducer = require('./signupReducer');
const navigationReducer = require('./navigationReducer');

module.exports = combineReducers({
  credentials: credentialsReducer,
  login: loginReducer,
  signup: signupReducer,
  navigation: navigationReducer,
});
