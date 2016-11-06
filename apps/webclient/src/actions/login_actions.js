import apiClient from '../api/apiClient';

const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

const LOGIN_BY_EMAIL = 'LOGIN_BY_EMAIL';
const LOGIN_BY_EMAIL_PENDING = 'LOGIN_BY_EMAIL_PENDING';
const LOGIN_BY_EMAIL_REJECTED = 'LOGIN_BY_EMAIL_REJECTED';
const LOGIN_BY_EMAIL_FULFILLED = 'LOGIN_BY_EMAIL_FULFILLED';

const LOGIN_CREDENTIAL_TYPE_EMAIL = 'LOGIN_CREDENTIAL_TYPE_EMAIL';
const LOGIN_CREDENTIAL_TYPE_PASSWORD = 'LOGIN_CREDENTIAL_TYPE_PASSWORD';
const LOGIN_CREDENTIAL_CHANGE = 'LOGIN_CREDENTIAL_CHANGE';
const LOGIN_VALIDATION_ERROR = 'LOGIN_VALIDATION_ERROR';
const {
    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
} = require('./generic_errors');
const CLEAR_LOGIN_ERROR_IF_EXISTS = 'CLEAR_LOGIN_ERROR_IF_EXISTS';

module.exports = {
    TOGGLE_SNACKBAR,
    toggleSnackbar: function() {
        return {
            type: TOGGLE_SNACKBAR,
        };
    },
    LOGIN_BY_EMAIL_PENDING,
    LOGIN_BY_EMAIL_REJECTED,
    LOGIN_BY_EMAIL_FULFILLED,
    loginByEmail: function(email, password) {
        return {
            type: LOGIN_BY_EMAIL,
            payload: apiClient().then(client => {
                return client.login.post_login_by_email({
                    "bodyparam-login-by-emailpost": {
                        email,
                        password,
                    },
                });
            }),
        };
    },
    LOGIN_CREDENTIAL_TYPE_EMAIL,
    LOGIN_CREDENTIAL_TYPE_PASSWORD,
    LOGIN_CREDENTIAL_CHANGE,
    loginCredentialChange: function(credentialType, newValue) {
        return {
            type: LOGIN_CREDENTIAL_CHANGE,
            payload: {
                type: credentialType,
                newValue,
            },
        };
    },
    LOGIN_VALIDATION_ERROR,
    loginValidationError: function(errorName) {
        return {
            type: LOGIN_VALIDATION_ERROR,
            payload: errorName,
        };
    },
    CLEAR_LOGIN_ERROR_IF_EXISTS,
    clearLoginErrorIfExists: function(errorName) {
        return {
            type: CLEAR_LOGIN_ERROR_IF_EXISTS,
            payload: errorName,
        };
    },
};
