import { CLEAR_LOGIN_ERROR_IF_EXISTS } from './login-actions';
import Immutable from 'immutable';
import { INVALID_EMAIL_ERROR } from '../../components/generic-errors';
import { LOGIN_BY_EMAIL_FULFILLED } from './login-actions';
import { LOGIN_BY_EMAIL_REJECTED } from './login-actions';
import { LOGIN_VALIDATION_ERROR } from './login-actions';
import { PASSWORDS_DONT_MATCH_ERROR } from '../../components/generic-errors';
import { SIGNUP_BY_EMAIL_FULFILLED } from './components/signup/signup-actions';

export default function loginReducer(state = Immutable.fromJS({
  state: {
    loginErrors: {},
  },
}), action) {
  switch (action.type) {
    case LOGIN_BY_EMAIL_REJECTED: {
      if (action.payload) {
        return state
          .setIn([ 'loginErrors', 'emailErrorText' ], action.payload);
      } else {
        return state;
      }
    }
    case LOGIN_VALIDATION_ERROR: {
      if (action.payload === INVALID_EMAIL_ERROR) {
        return state
          .setIn([ 'loginErrors', 'emailErrorText' ], "Invalid Email Format");
      } else {
        console.log("Unmatched error");
        return state;
      }
    }
    case CLEAR_LOGIN_ERROR_IF_EXISTS: {
      if (action.payload === INVALID_EMAIL_ERROR) {
        return state
          .deleteIn([ 'loginErrors', 'emailErrorText' ]);
      } else {
        console.log("Unmatched error");
        return state;
      }
    }
    default:
      return state;
  }
}
