/*
 * action types
 */
const SET_CREDENTIALS = 'SET_CREDENTIALS';
const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';


module.exports = {
    SET_CREDENTIALS,
    setCredentials: function(username, password) {
        return {
            type: SET_CREDENTIALS,
            username,
            password,
        };
    },
    TOGGLE_SIGNUP_DIALOG,
    toggleSignupDialog: function() {
        return {
            type: TOGGLE_SIGNUP_DIALOG,
        };
    },
};
