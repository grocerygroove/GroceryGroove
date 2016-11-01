/*
 * action types
 */
const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';
const SET_USERNAME = 'SET_USERNAME';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_CONFIRM_PASSWORD = 'SET_CONFIRM_PASSWORD';
const CANCEL_SIGNUP = 'CANCEL_SIGNUP';
const SPIT_STORE = 'SPIT_STORE';

module.exports = {
    TOGGLE_SIGNUP_DIALOG,
    toggleSignupDialog: function() {
        return {
            type: TOGGLE_SIGNUP_DIALOG,
        };
    },
    SET_USERNAME,
    setUsername: function(username) {
        return {
            type: SET_USERNAME,
            username,
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
    SPIT_STORE,
    spitStore: function() {
        return {
            type: SPIT_STORE,
        };
    },
};
