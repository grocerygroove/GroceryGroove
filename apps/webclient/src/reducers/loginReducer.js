const Immutable = require("seamless-immutable");
const { TOGGLE_SNACKBAR } = require('../actions/login_actions');
const { SIGNUP_BY_EMAIL_FULFILLED } = require('../actions/signup_actions');

module.exports = function loginReducer(state = { }, action) {
    switch (action.type) {
        case SIGNUP_BY_EMAIL_FULFILLED: {
            return Immutable(state).merge({
                snackbar: {
                    open: !state.snackbar.open,
                    message: "Account creation successful",
                },
            });
        }
        case TOGGLE_SNACKBAR: {
            return Immutable(state)
                .updateIn([ 'snackbar', 'open' ], (prevState) => { return !prevState; });
        }
        default:
            return state;
    }
};
