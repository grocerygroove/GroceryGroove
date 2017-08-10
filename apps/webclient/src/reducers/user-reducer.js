import { GET_HOUSEHOLDS_FULFILLED } from '../actions/user-actions';
import Immutable from 'immutable';

export default function userReducer(state = Immutable.fromJS({}), action) {
  switch (action.type) {
    case GET_HOUSEHOLDS_FULFILLED: {
      return state
        .set('households', action.payload)
        .set('selectedHouseholdId', action.payload[0].household_id);
    }
    default:
      return state;
  }
}
