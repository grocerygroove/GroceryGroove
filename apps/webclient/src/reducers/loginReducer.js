const { TOGGLE_SIGNUP_DIALOG } = require('../actions/login_actions');

module.exports = function loginReducer(state = { }, action) {
    switch (action.type) {
        case TOGGLE_SIGNUP_DIALOG:
            return Object.assign({}, state, {
                signupDialogVisible: !state.signupDialogVisible,
            });
        default:
            return state;
    }
};
