const Immutable = require("seamless-immutable");
const { LOGIN_BY_EMAIL_FULFILLED } = require('../actions/login_actions');

module.exports = function credentialsReducer(state = {}, action) {
    switch (action.type) {
        case LOGIN_BY_EMAIL_FULFILLED: {
            return Immutable(state).set('token', JSON.parse(action.payload.data).token);
        }
        default:
            return Immutable(state);
    }
};
