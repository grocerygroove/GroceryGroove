import { GET_CATEGORIES_FULFILLED } from './settings-actions';
import { GET_CATEGORIES_PENDING } from './settings-actions';
import { GET_CATEGORIES_REJECTED } from './settings-actions';
import Immutable from 'immutable';

export default function settingsReducer(
  state = Immutable.fromJS({
    categories: [],
  }), action) {

  switch (action.type) {
    case GET_CATEGORIES_FULFILLED: {
      return state.set('categories', Immutable.fromJS(action.payload));
    }
    default:
      return state;
  }
}
