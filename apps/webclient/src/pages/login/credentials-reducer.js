import { LOGIN_BY_EMAIL_FULFILLED } from './login-actions';
import Immutable from 'immutable';

export default function credentialsReducer(state = Immutable.fromJS({}), action) {
  switch (action.type) {
    case LOGIN_BY_EMAIL_FULFILLED: {
      return state.set('token', action.payload);
    }
    default:
      return state;
  }
}
