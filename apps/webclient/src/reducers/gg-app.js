import categoriesReducer from '../pages/categories/categories-reducer';
import { combineReducers } from 'redux-immutable';
import credentialsReducer from '../pages/login/credentials-reducer';
import loginReducer from '../pages/login/login-reducer';
import navigationReducer from '../components/navigation-reducer';
import signupReducer from '../pages/login/signup-reducer';
import userReducer from './user-reducer';


export default combineReducers({
  credentials: credentialsReducer,
  login: loginReducer,
  signup: signupReducer,
  navigation: navigationReducer,
  user: userReducer,
  categories: categoriesReducer,
});
