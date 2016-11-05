const {
    SIGNUP_BY_EMAIL,
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

module.exports = function credentialsReducer(state = {}, action) {
    switch (action.type) {
        case TOGGLE_SIGNUP_DIALOG:
            return Object.assign({}, state, {
                signupDialogVisible: !state.signupDialogVisible,
            });
        case SIGNUP_VALIDATION_ERROR: {
            const signupErrors = Object.assign({}, state.signupErrors);
            if (action.payload === INVALID_EMAIL_ERROR) {
                signupErrors.invalidEmail = true;
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                signupErrors.passwordsDontMatch = true;
            } else {
                console.log("Unmatched error");
                return state;
            }
            return Object.assign({}, state, {
                signupErrors,
            });
        }
        case CLEAR_SIGNUP_ERROR_IF_EXISTS: {
            const signupErrors = Object.assign({}, state.signupErrors);
            if (action.payload === INVALID_EMAIL_ERROR) {
                delete signupErrors.invalidEmail;
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                delete signupErrors.passwordsDontMatch;
            } else {
                console.log("Unmatched error");
                return state;
            }
            return Object.assign({}, state, {
                signupErrors,
            });
        }
        case SIGNUP_CREDENTIAL_CHANGE: {
            const signupCreds = state.signupCreds ? Object.assign({}, state.signupCreds) : {};
            const credType = action.payload.type;
            if (credType === SIGNUP_CREDENTIAL_TYPE_EMAIL) {
                signupCreds.email = action.payload.newValue;
            } else if (credType === SIGNUP_CREDENTIAL_TYPE_PASSWORD) {
                signupCreds.password = action.payload.newValue;
            } else if (credType === SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD) {
                signupCreds.confirmPassword = action.payload.newValue;
            } else {
                console.log("Unmatched type");
                return state;
            }
            return Object.assign({}, state, {
                signupCreds,
            });
        }
        default:
            return state;
    }
};
