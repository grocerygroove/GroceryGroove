import { CLEAR_SIGNUP_ERROR_IF_EXISTS } from './signup-actions';
import Immutable from 'immutable';
import { INVALID_EMAIL_ERROR } from '../../components/generic-errors';
import { PASSWORDS_DONT_MATCH_ERROR } from '../../components/generic-errors';
import { SIGNUP_BY_EMAIL_FULFILLED } from './signup-actions';
import { SIGNUP_BY_EMAIL_PENDING } from './signup-actions';
import { SIGNUP_BY_EMAIL_REJECTED } from './signup-actions';
import { SIGNUP_CREDENTIAL_CHANGE } from './signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD } from './signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_EMAIL } from './signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_PASSWORD } from './signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_NICKNAME } from './signup-actions';
import { SIGNUP_VALIDATION_ERROR } from './signup-actions';
import { TOGGLE_SIGNUP_DIALOG } from './signup-actions';

export default function signupReducer(state = Immutable.fromJS({}), action) {
  switch (action.type) {
    case SIGNUP_BY_EMAIL_PENDING: {
      return state.set('requestPending', true);
    }
    case SIGNUP_BY_EMAIL_REJECTED: {
      if (action.payload.issueParameter === "email") {
        return state
          .set('requestPending', false)
          .setIn([ 'signupErrors', 'emailErrorText' ], action.payload.message);

      } else {
        return state
          .set('requestPending', false);
      }
    }
    case SIGNUP_BY_EMAIL_FULFILLED: {
      return state
        .set('requestPending', false)
        .update('signupDialogVisible', prevState => !prevState)
        .delete('signupErrors')
        .delete('signupCreds');
    }
    case TOGGLE_SIGNUP_DIALOG: {
      return state
        .update('signupDialogVisible', prevState => !prevState);
    }
    case SIGNUP_VALIDATION_ERROR: {
      if (action.payload === INVALID_EMAIL_ERROR) {
        return state
          .setIn([ 'signupErrors', 'emailErrorText' ], "Invalid Email Format");
      } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
        return state
          .setIn([ 'signupErrors', 'passwordsErrorText' ], "Passwords Don't Match");
      } else {
        console.log("Unmatched error");
        return state;
      }
    }
    case CLEAR_SIGNUP_ERROR_IF_EXISTS: {
      if (action.payload === INVALID_EMAIL_ERROR) {
        return state
          .deleteIn([ 'signupErrors', 'emailErrorText' ]);

      } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
        return state
          .deleteIn([ 'signupErrors', 'passwordsErrorText' ]);
      } else {
        console.log("Unmatched error");
        return state;
      }
    }
    case SIGNUP_CREDENTIAL_CHANGE: {
      const credType = action.payload.type;
      if (credType === SIGNUP_CREDENTIAL_TYPE_EMAIL) {
        return state
          .setIn([ 'signupCreds', 'email' ], action.payload.newValue);
      } else if (credType === SIGNUP_CREDENTIAL_TYPE_NICKNAME) { 
        return state
          .setIn([ 'signupCreds', 'nickname' ], action.payload.newValue);
      }else if (credType === SIGNUP_CREDENTIAL_TYPE_PASSWORD) {
        return state
          .setIn([ 'signupCreds', 'password' ], action.payload.newValue);
      } else if (credType === SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD) {
        return state
          .setIn([ 'signupCreds', 'confirmPassword' ], action.payload.newValue);
      } else {
        console.log("Unmatched type");
        return state;
      }
    }
    default:
      return state;
  }
}
