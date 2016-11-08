import { combineReducers } from 'redux-immutable';
import credentialsReducer from './credentialsReducer';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import navigationReducer from './navigationReducer';

export default combineReducers({
  credentials: credentialsReducer,
  login: loginReducer,
  signup: signupReducer,
  navigation: navigationReducer,
});
