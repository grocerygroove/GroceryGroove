import { GET_HOUSEHOLDS_FULFILLED } from '../actions/user-actions';
import { SET_SELECTED_HOUSEHOLD } from '../actions/user-actions';
import Immutable from 'immutable';

export default function userReducer(state = Immutable.fromJS({}), action) {
  switch (action.type) {
    case GET_HOUSEHOLDS_FULFILLED: {
      return state
        .set('households', action.payload);
    }
    case SET_SELECTED_HOUSEHOLD: {
      return state
        .set('selectedHouseholdId', action.payload);
    }
    default:
      return state;
  }
}
