import { SIGNUP_BY_EMAIL_FULFILLED } from './signup-actions';
import { SIGNUP_BY_EMAIL_REJECTED } from './signup-actions';
import { TOGGLE_SIGNUP_DIALOG } from './signup-actions';
import Immutable from 'immutable';

export default function signupReducer(state = Immutable.fromJS({
  visible: false,
  errors: {},
}), action) {
  switch (action.type) {
    case SIGNUP_BY_EMAIL_REJECTED: {
      if (action.payload.issueParameter === "email") {
        return state
          .setIn([ 'errors', 'email' ], action.payload.message);
      }
    }
    case SIGNUP_BY_EMAIL_FULFILLED: {
      return state
        .update('visible', prevState => !prevState)
        .deleteIn([ 'errors', 'email' ]);
    }
    case TOGGLE_SIGNUP_DIALOG: {
      return state
        .update('visible', prevState => !prevState);
    }
    default:
      return state;
  }
}
