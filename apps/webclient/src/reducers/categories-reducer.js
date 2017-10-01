import { GET_CATEGORIES_FULFILLED } from '../actions/categories-actions';
import { GET_CATEGORIES_PENDING } from '../actions/categories-actions';
import { GET_CATEGORIES_REJECTED } from '../actions/categories-actions';
import Immutable from 'immutable';

export default function categoriesReducer(
  state = Immutable.fromJS([]), action) {

  switch (action.type) {
    case GET_CATEGORIES_FULFILLED: {
      return Immutable.fromJS(action.payload);
    }
    default:
      return state;
  }
}
