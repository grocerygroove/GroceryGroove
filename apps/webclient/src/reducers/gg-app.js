import addGroceryListItemReducer from '../pages/grocery-lists/components/add-item/add-item-reducer';
import addGroceryListReducer from '../pages/grocery-lists/components/add-grocery-list/add-grocery-list-reducer';
import { combineReducers } from 'redux-immutable';
import credentialsReducer from '../pages/login/credentials-reducer';
import groceryListsReducer from '../pages/grocery-lists/grocery-lists-reducer';
import loginReducer from '../pages/login/login-reducer';
import pageReducer from '../components/page-reducer';
import categoriesReducer from './categories-reducer';
import quantityTypesReducer from './quantity-types-reducer';
import signupReducer from '../pages/login/components/signup/signup-reducer';
import userReducer from './user-reducer';


export default combineReducers({
  credentials: credentialsReducer,
  login: combineReducers({
    state: loginReducer,
    signup: signupReducer,
  }),
  page: pageReducer,
  user: userReducer,
  categories: categoriesReducer,
  quantityTypes: quantityTypesReducer,
  groceryLists: combineReducers({
    state: groceryListsReducer, 
    addGroceryListDialog: addGroceryListReducer,
    addItemDialog: addGroceryListItemReducer,
  }),
});
