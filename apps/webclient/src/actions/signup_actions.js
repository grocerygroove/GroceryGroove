import apiClient from '../api/apiClient';
/*
 * action types
 */
const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';

const SIGNUP_BY_EMAIL = 'SIGNUP_BY_EMAIL';

const SIGNUP_CREDENTIAL_TYPE_EMAIL = 'SIGNUP_CREDENTIAL_TYPE_EMAIL';
const SIGNUP_CREDENTIAL_TYPE_PASSWORD = 'SIGNUP_CREDENTIAL_TYPE_PASSWORD';
const SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD = 'SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD';
const SIGNUP_CREDENTIAL_CHANGE = 'SIGNUP_CREDENTIAL_CHANGE';



const INVALID_EMAIL_ERROR = 'INVALID_EMAIL_ERROR';
const PASSWORDS_DONT_MATCH_ERROR = 'PASSWORDS_DONT_MATCH_ERROR';
const SIGNUP_VALIDATION_ERROR = 'SIGNUP_VALIDATION_ERROR';
const CLEAR_SIGNUP_ERROR_IF_EXISTS = 'CLEAR_SIGNUP_ERROR_IF_EXISTS';

module.exports = {
    TOGGLE_SIGNUP_DIALOG,
    toggleSignupDialog: function() {
        return {
            type: TOGGLE_SIGNUP_DIALOG,
        };
    },
    SIGNUP_BY_EMAIL,
    signupByEmail: function(email, password) {
        return {
            type: SIGNUP_BY_EMAIL,
            payload: apiClient().then(client => {
                return client.signup.post_signup_by_email({
                    "bodyparam-signup-by-emailpost": {
                        email,
                        password,
                    },
                });
            }),
        };
    },
    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
    SIGNUP_VALIDATION_ERROR,
    signupValidationError: function(errorName) {
        return {
            type: SIGNUP_VALIDATION_ERROR,
            payload: errorName,
        };
    },
    CLEAR_SIGNUP_ERROR_IF_EXISTS,
    clearSignupErrorIfExists: function(errorName) {
        return {
            type: CLEAR_SIGNUP_ERROR_IF_EXISTS,
            payload: errorName,
        };
    },
    SIGNUP_CREDENTIAL_TYPE_EMAIL,
    SIGNUP_CREDENTIAL_TYPE_PASSWORD,
    SIGNUP_CREDENTIAL_CHANGE,
    SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD,
    signupCredentialChange: function(credentialType, newValue) {
        return {
            type: SIGNUP_CREDENTIAL_CHANGE,
            payload: {
                type: credentialType,
                newValue,
            },
        };
    },
};
