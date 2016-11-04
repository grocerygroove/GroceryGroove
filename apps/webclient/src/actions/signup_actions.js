import apiClient from '../api/apiClient';
/*
 * action types
 */
const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';
const SET_EMAIL = 'SET_EMAIL';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_CONFIRM_PASSWORD = 'SET_CONFIRM_PASSWORD';
const CANCEL_SIGNUP = 'CANCEL_SIGNUP';
const SIGNUP_BY_EMAIL = 'SIGNUP_BY_EMAIL';

module.exports = {
    TOGGLE_SIGNUP_DIALOG,
    toggleSignupDialog: function() {
        return {
            type: TOGGLE_SIGNUP_DIALOG,
        };
    },
    SET_EMAIL,
    setEmail: function(email) {
        return {
            type: SET_EMAIL,
            email,
        };
    },
    SET_PASSWORD,
    setPassword: function(password) {
        return {
            type: SET_PASSWORD,
            password,
        };
    },
    SET_CONFIRM_PASSWORD,
    setConfirmPassword: function(confirmPassword) {
        return {
            type: SET_CONFIRM_PASSWORD,
            confirmPassword,
        };
    },
    CANCEL_SIGNUP,
    cancelSignup: function() {
        return {
            type: CANCEL_SIGNUP,
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

};
