const { combineReducers } = require('redux');
const credentialsReducer = require('./credentialsReducer');
const loginReducer = require('./loginReducer');

module.exports = combineReducers({
  credentials: credentialsReducer,
  login: loginReducer,
});
