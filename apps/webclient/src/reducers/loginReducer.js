const Immutable = require("seamless-immutable");
const {
    TOGGLE_SNACKBAR,
    LOGIN_CREDENTIAL_CHANGE,
    LOGIN_CREDENTIAL_TYPE_EMAIL,
    LOGIN_CREDENTIAL_TYPE_PASSWORD,
    LOGIN_VALIDATION_ERROR,
    CLEAR_LOGIN_ERROR_IF_EXISTS,
    LOGIN_BY_EMAIL_PENDING,
    LOGIN_BY_EMAIL_REJECTED,
    LOGIN_BY_EMAIL_FULFILLED,
 } = require('../actions/login_actions');
const {
    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
} = require('../actions/generic_errors');
const { SIGNUP_BY_EMAIL_FULFILLED } = require('../actions/signup_actions');

module.exports = function loginReducer(state = { }, action) {
    switch (action.type) {
        case LOGIN_BY_EMAIL_PENDING: {
            return Immutable(state).set('requestPending', true);
        }
        case LOGIN_BY_EMAIL_REJECTED: {
            const responseObject = JSON.parse(action.payload.statusText);
            let immutState = Immutable(state).set('requestPending', false);
            if (responseObject && responseObject.message) {
                return immutState.setIn([ 'loginErrors', 'emailErrorText' ], responseObject.message);
            } else {
                return immutState;
            }
        }
        case LOGIN_BY_EMAIL_FULFILLED: {
            console.log(action);
            let immutState = Immutable(state).set('requestPending', false);
            return immutState.without([ 'loginErrors', 'loginCreds' ]);
        }
        case SIGNUP_BY_EMAIL_FULFILLED: {
            return Immutable(state).merge({
                snackbar: {
                    open: !state.snackbar.open,
                    message: "Account creation successful",
                },
            });
        }
        case TOGGLE_SNACKBAR: {
            return Immutable(state)
                .updateIn([ 'snackbar', 'open' ], (prevState) => { return !prevState; });
        }
        case LOGIN_CREDENTIAL_CHANGE: {
            const credType = action.payload.type;
            if (credType === LOGIN_CREDENTIAL_TYPE_EMAIL) {
                return Immutable(state).setIn([ 'loginCreds', 'email' ], action.payload.newValue);
            } else if (credType === LOGIN_CREDENTIAL_TYPE_PASSWORD) {
                return Immutable(state).setIn([ 'loginCreds', 'password' ], action.payload.newValue);
            } else {
                console.log("Unmatched type");
                return Immutable(state);
            }
        }
        case LOGIN_VALIDATION_ERROR: {
            if (action.payload === INVALID_EMAIL_ERROR) {
                return Immutable(state).setIn([ 'loginErrors', 'emailErrorText' ], "Invalid Email Format");
            } else {
                console.log("Unmatched error");
                return Immutable(state);
            }
        }
        case CLEAR_LOGIN_ERROR_IF_EXISTS: {
            let immutState = Immutable(state);
            if (action.payload === INVALID_EMAIL_ERROR) {
                //withoutIn is stuck behind a pull request atm...have
                //to do some trickery to delete nested keys
                immutState = immutState.asMutable({deep: true});
                if ( immutState.loginErrors && immutState.loginErrors.emailErrorText ) {
                    delete immutState.loginErrors.emailErrorText;
                }
                return Immutable(immutState);
            } else {
                console.log("Unmatched error");
                return Immutable(state);
            }
        }
        default:
            return state;
    }
};
