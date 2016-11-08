import apiClient from '../api/apiClient';

export const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

export const LOGIN_BY_EMAIL = 'LOGIN_BY_EMAIL';
export const LOGIN_BY_EMAIL_PENDING = 'LOGIN_BY_EMAIL_PENDING';
export const LOGIN_BY_EMAIL_REJECTED = 'LOGIN_BY_EMAIL_REJECTED';
export const LOGIN_BY_EMAIL_FULFILLED = 'LOGIN_BY_EMAIL_FULFILLED';

export const LOGIN_CREDENTIAL_TYPE_EMAIL = 'LOGIN_CREDENTIAL_TYPE_EMAIL';
export const LOGIN_CREDENTIAL_TYPE_PASSWORD = 'LOGIN_CREDENTIAL_TYPE_PASSWORD';
export const LOGIN_CREDENTIAL_CHANGE = 'LOGIN_CREDENTIAL_CHANGE';
export const LOGIN_VALIDATION_ERROR = 'LOGIN_VALIDATION_ERROR';

export const CLEAR_LOGIN_ERROR_IF_EXISTS = 'CLEAR_LOGIN_ERROR_IF_EXISTS';


export function toggleSnackbar() {
    return {
        type: TOGGLE_SNACKBAR,
    };
}

export function loginByEmail(email, password) {
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
}

export function loginCredentialChange(credentialType, newValue) {
    return {
        type: LOGIN_CREDENTIAL_CHANGE,
        payload: {
            type: credentialType,
            newValue,
        },
    };
}

export function loginValidationError(errorName) {
    return {
        type: LOGIN_VALIDATION_ERROR,
        payload: errorName,
    };
}

export function clearLoginErrorIfExists(errorName) {
    return {
        type: CLEAR_LOGIN_ERROR_IF_EXISTS,
        payload: errorName,
    };
}
