const { SET_CREDENTIALS } = require('../actions/login_actions');

module.exports = function credentialsReducer(state = {}, action) {
    switch (action.type) {
        case SET_CREDENTIALS:
            return Object.assign({}, state, {
                username: action.username,
                password: action.password,
            });
        default:
            return state;
    }
};
