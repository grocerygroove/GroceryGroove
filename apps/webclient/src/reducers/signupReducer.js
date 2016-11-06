const Immutable = require("seamless-immutable");
const {
    SIGNUP_BY_EMAIL_PENDING,
    SIGNUP_BY_EMAIL_REJECTED,
    SIGNUP_BY_EMAIL_FULFILLED,
    TOGGLE_SIGNUP_DIALOG,
    SIGNUP_CREDENTIAL_TYPE_EMAIL,
    SIGNUP_CREDENTIAL_TYPE_PASSWORD,
    SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD,
    SIGNUP_CREDENTIAL_CHANGE,
    SIGNUP_VALIDATION_ERROR,
    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
    CLEAR_SIGNUP_ERROR_IF_EXISTS,
 } = require('../actions/signup_actions');

module.exports = function signupReducer(state = {}, action) {
    switch (action.type) {
        case SIGNUP_BY_EMAIL_PENDING: {
            return Immutable(state).set('requestPending', true);
        }
        case SIGNUP_BY_EMAIL_REJECTED: {
            const responseObject = JSON.parse(action.payload.statusText);
            const temp = {
                requestPending: false,
                signupErrors: Object.assign({}, state.signupErrors),
            };
            if (responseObject.issueParameter === "email") {
                temp.signupErrors.emailErrorText = responseObject.message;
            }
            return Immutable(state).merge(temp);
        }
        case SIGNUP_BY_EMAIL_FULFILLED: {
            let immutState = Immutable(state);
            immutState = immutState.set('requestPending', false);
            immutState = immutState.update('signupDialogVisible', (prevState) => { return !prevState; });
            return immutState.without([ 'signupErrors', 'signupCreds' ]);
        }
        case TOGGLE_SIGNUP_DIALOG: {
            return Immutable(state).update('signupDialogVisible', (prevState) => { return !prevState; });
        }
        case SIGNUP_VALIDATION_ERROR: {
            const signupErrors = Object.assign({}, state.signupErrors);
            if (action.payload === INVALID_EMAIL_ERROR) {
                signupErrors.emailErrorText = "Invalid Email";
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                signupErrors.passwordsErrorText = "Passwords Don't Match";
            } else {
                console.log("Unmatched error");
                return Immutable(state);
            }
            return Immutable(state).set('signupErrors', signupErrors);
        }
        case CLEAR_SIGNUP_ERROR_IF_EXISTS: {
            let immutState = Immutable(state);
            if (action.payload === INVALID_EMAIL_ERROR) {
                //withoutIn is stuck behind a pull request atm...have
                //to do some trickery to delete nested keys
                immutState = immutState.asMutable({deep: true});
                if ( immutState.signupErrors && immutState.signupErrors.emailErrorText ) {
                    delete immutState.signupErrors.emailErrorText;
                }
                immutState = Immutable(immutState);
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                immutState = immutState.asMutable({deep: true});
                if ( immutState.signupErrors && immutState.signupErrors.passwordsErrorText ) {
                    delete immutState.signupErrors.passwordsErrorText;
                }
                immutState = Immutable(immutState);
            } else {
                console.log("Unmatched error");
                return Immutable(state);
            }
            return immutState;
        }
        case SIGNUP_CREDENTIAL_CHANGE: {
            const credType = action.payload.type;
            if (credType === SIGNUP_CREDENTIAL_TYPE_EMAIL) {
                return Immutable(state).setIn([ 'signupCreds', 'email' ], action.payload.newValue);
            } else if (credType === SIGNUP_CREDENTIAL_TYPE_PASSWORD) {
                return Immutable(state).setIn([ 'signupCreds', 'password' ], action.payload.newValue);
            } else if (credType === SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD) {
                return Immutable(state).setIn([ 'signupCreds', 'confirmPassword' ], action.payload.newValue);
            } else {
                console.log("Unmatched type");
                return Immutable(state);
            }
        }
        default:
            return Immutable(state);
    }
};
