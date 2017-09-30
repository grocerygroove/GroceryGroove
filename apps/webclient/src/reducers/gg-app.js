import addGroceryListReducer from '../pages/grocery-lists/components/add-grocery-list-reducer';
import { combineReducers } from 'redux-immutable';
import credentialsReducer from '../pages/login/credentials-reducer';
import groceryListsReducer from '../pages/grocery-lists/grocery-lists-reducer';
import loginReducer from '../pages/login/login-reducer';
import pageReducer from '../components/page-reducer';
import settingsReducer from '../pages/settings/settings-reducer';
import signupReducer from '../pages/login/signup-reducer';
import userReducer from './user-reducer';


export default combineReducers({
  credentials: credentialsReducer,
  login: loginReducer,
  signup: signupReducer,
  page: pageReducer,
  user: userReducer,
  settings: settingsReducer,
  groceryLists: combineReducers({
    state: groceryListsReducer, 
    addGroceryListDialog: addGroceryListReducer,
  }),
});
