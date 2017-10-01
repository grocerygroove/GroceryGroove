import { GET_QUANTITY_TYPES_FULFILLED } from '../actions/quantity-types-actions';
import { GET_QUANTITY_TYPES_PENDING } from '../actions/quantity-types-actions';
import { GET_QUANTITY_TYPES_REJECTED } from '../actions/quantity-types-actions';
import Immutable from 'immutable';

export default function quantityTypesReducer(
  state = Immutable.fromJS([]), action) {
  switch (action.type) {
    case GET_QUANTITY_TYPES_FULFILLED: {
      return Immutable.fromJS(action.payload);
    }
    default:
      return state;
  }
}
