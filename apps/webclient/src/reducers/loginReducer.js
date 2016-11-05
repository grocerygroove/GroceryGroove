const { TOGGLE_SNACKBAR } = require('../actions/login_actions');
const { SIGNUP_BY_EMAIL_FULFILLED } = require('../actions/signup_actions');

module.exports = function loginReducer(state = { }, action) {
    switch (action.type) {
        case SIGNUP_BY_EMAIL_FULFILLED: {
            const snackbar = state.snackbar || { open: false, message: ""};
            snackbar.open = !snackbar.open;
            snackbar.message = "Account creation successful"
            return Object.assign({}, state, {
                snackbar,
            });
        }
        case TOGGLE_SNACKBAR: {
            const snackbar = state.snackbar || { open: false, message: ""};
            snackbar.open = !snackbar.open;
            return Object.assign({}, state, {
                snackbar,
            });
        }
        default:
            return state;
    }
};
