import { GET_GROCERY_LISTS_REJECTED } from './grocery-lists-actions';
import { GET_GROCERY_LISTS_PENDING } from './grocery-lists-actions';
import { GET_GROCERY_LISTS_FULFILLED } from './grocery-lists-actions';
import Immutable from 'immutable';

export default function groceryListsReducer(
  state = Immutable.fromJS({
    lists: [],
  }), action) {

  switch (action.type) {
    case GET_GROCERY_LISTS_FULFILLED: {
      return state.set('lists',
        Immutable.fromJS(action.payload));
    }
    default:
      return state;
  }
}
