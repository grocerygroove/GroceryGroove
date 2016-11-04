const { TOGGLE_SIGNUP_DIALOG, SET_PASSWORD, SET_USERNAME, SET_CONFIRM_PASSWORD, CANCEL_SIGNUP } = require('../actions/signup_actions');

module.exports = function credentialsReducer(state = {}, action) {
    switch (action.type) {
        case TOGGLE_SIGNUP_DIALOG:
            return Object.assign({}, state, {
                signupDialogVisible: !state.signupDialogVisible,
            });
        case SET_PASSWORD:
            return Object.assign({}, state, {
                password: action.password,
            });
        case SET_USERNAME:
            return Object.assign({}, state, {
                username: action.username,
            });
        case SET_CONFIRM_PASSWORD:
            return Object.assign({}, state, {
                confirmPassword: action.confirmPassword,
            });
        case CANCEL_SIGNUP:
            const tempState = Object.assign({}, state, {
                signupDialogVisible: !state.signupDialogVisible,
            });
            delete tempState.username;
            delete tempState.password;
            delete tempState.confirmPassword;
            return tempState;
        default:
            return state;
    }
};
