import Immutable from 'immutable';
import {
    SIGNUP_BY_EMAIL_PENDING,
    SIGNUP_BY_EMAIL_REJECTED,
    SIGNUP_BY_EMAIL_FULFILLED,
    TOGGLE_SIGNUP_DIALOG,
    SIGNUP_CREDENTIAL_TYPE_EMAIL,
    SIGNUP_CREDENTIAL_TYPE_PASSWORD,
    SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD,
    SIGNUP_CREDENTIAL_CHANGE,
    SIGNUP_VALIDATION_ERROR,
    CLEAR_SIGNUP_ERROR_IF_EXISTS,
 } from '../actions/signup_actions';
import {
    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
} from '../actions/generic_errors';

export default function signupReducer(state = Immutable.fromJS({}), action) {
    switch (action.type) {
        case SIGNUP_BY_EMAIL_PENDING: {
            return state.set('requestPending', true);
        }
        case SIGNUP_BY_EMAIL_REJECTED: {
            const responseObject = JSON.parse(action.payload.statusText);
            if (responseObject.issueParameter === "email") {
                return state
                        .set('requestPending', false)
                        .setIn([ 'signupErrors', 'emailErrorText' ], responseObject.message);

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
            } else if (credType === SIGNUP_CREDENTIAL_TYPE_PASSWORD) {
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
