import Immutable from 'immutable';
const { LOGIN_BY_EMAIL_FULFILLED } = require('../actions/login_actions');

module.exports = function credentialsReducer(state = Immutable.fromJS({}), action) {
    switch (action.type) {
        case LOGIN_BY_EMAIL_FULFILLED: {
            return state.set('token', JSON.parse(action.payload.data).token);
        }
        default:
            return state;
    }
};
