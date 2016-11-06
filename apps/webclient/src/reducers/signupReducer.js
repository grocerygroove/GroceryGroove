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
    CLEAR_SIGNUP_ERROR_IF_EXISTS,
 } = require('../actions/signup_actions');
 const {
    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
} = require('../actions/generic_errors');

module.exports = function signupReducer(state = {}, action) {
    switch (action.type) {
        case SIGNUP_BY_EMAIL_PENDING: {
            return Immutable(state).set('requestPending', true);
        }
        case SIGNUP_BY_EMAIL_REJECTED: {
            const responseObject = JSON.parse(action.payload.statusText);
            let immutState = Immutable(state).set('requestPending', false);
            if (responseObject.issueParameter === "email") {
                return immutState.setIn([ 'signupErrors', 'emailErrorText' ], responseObject.message);

            } else {
                return immutState;
            }
        }
        case SIGNUP_BY_EMAIL_FULFILLED: {
            let immutState = Immutable(state).set('requestPending', false);
            immutState = immutState.update('signupDialogVisible', (prevState) => { return !prevState; });
            return immutState.without([ 'signupErrors', 'signupCreds' ]);
        }
        case TOGGLE_SIGNUP_DIALOG: {
            return Immutable(state).update('signupDialogVisible', (prevState) => { return !prevState; });
        }
        case SIGNUP_VALIDATION_ERROR: {
            if (action.payload === INVALID_EMAIL_ERROR) {
                return Immutable(state).setIn([ 'signupErrors', 'emailErrorText' ], "Invalid Email Format");
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                return Immutable(state).setIn([ 'signupErrors', 'passwordsErrorText' ], "Passwords Don't Match");
            } else {
                console.log("Unmatched error");
                return Immutable(state);
            }
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
                return Immutable(immutState);
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                immutState = immutState.asMutable({deep: true});
                if ( immutState.signupErrors && immutState.signupErrors.passwordsErrorText ) {
                    delete immutState.signupErrors.passwordsErrorText;
                }
                return Immutable(immutState);
            } else {
                console.log("Unmatched error");
                return Immutable(state);
            }
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
