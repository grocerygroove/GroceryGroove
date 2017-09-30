import { GET_GROCERY_LISTS_REJECTED } from './grocery-lists-actions';
import { GET_GROCERY_LISTS_PENDING } from './grocery-lists-actions';
import { GET_GROCERY_LISTS_FULFILLED } from './grocery-lists-actions';
import { SET_LAST_CHECKED } from './grocery-lists-actions';
import { SET_SELECTED_GROCERY_LIST } from './grocery-lists-actions';
import Immutable from 'immutable';

export default function groceryListsReducer(
  state = Immutable.fromJS({
    lists: [],
    lastChecked: null,
    selectedGroceryListId: null,
  }), action) {

  switch (action.type) {
    case GET_GROCERY_LISTS_FULFILLED: {
      return state.set('lists',
        Immutable.fromJS(action.payload));
    }
    case SET_LAST_CHECKED: {
      return state.set('lastChecked',
        Immutable.fromJS(action.payload));
    }
    case SET_SELECTED_GROCERY_LIST: {
      return state.set('selectedGroceryListId',
        Immutable.fromJS(action.payload));
    }
    default:
      return state;
  }
}
