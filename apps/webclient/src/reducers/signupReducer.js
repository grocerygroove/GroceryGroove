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
            return Object.assign({}, state, {
                requestPending: true,
            });
        }
        case SIGNUP_BY_EMAIL_REJECTED: {
            const responseObject = JSON.parse(action.payload.statusText);
            const temp = {
                requestPending: false,
                signupErrors: Object.assign({}, state.signupErrors),
            };
            if(responseObject.issueParameter === "email") {
                temp.signupErrors.emailErrorText = responseObject.message;
            }
            return Object.assign({}, state, temp);
        }
        case SIGNUP_BY_EMAIL_FULFILLED: {
            console.log(action.payload);
            return Object.assign({}, state, {
                requestPending: false,
                signupDialogVisible: !state.signupDialogVisible,
                signupErrors: void(0),
                signupCreds: void(0),
            });
        }
        case TOGGLE_SIGNUP_DIALOG:
            return Object.assign({}, state, {
                signupDialogVisible: !state.signupDialogVisible,
            });
        case SIGNUP_VALIDATION_ERROR: {
            const signupErrors = Object.assign({}, state.signupErrors);
            if (action.payload === INVALID_EMAIL_ERROR) {
                signupErrors.emailErrorText = "Invalid Email";
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                signupErrors.passwordsErrorText = "Passwords Don't Match";
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
                delete signupErrors.emailErrorText;
            } else if (action.payload === PASSWORDS_DONT_MATCH_ERROR) {
                delete signupErrors.passwordsErrorText;
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
