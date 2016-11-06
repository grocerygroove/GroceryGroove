const Immutable = require("seamless-immutable");
const { CHANGE_PAGE, TOGGLE_DRAWER } = require('../actions/navigation_actions');
const { LOGIN_BY_EMAIL_FULFILLED } = require('../actions/login_actions');

module.exports = function nagivationReducer(state = { drawerOpen: false }, action) {
    switch (action.type) {
        case CHANGE_PAGE: {
            return Immutable(state).set('page', action.payload);
        }
        case TOGGLE_DRAWER: {
            return Immutable(state)
                .update('drawerOpen', (prevState) => { return !prevState; });
        }
        case LOGIN_BY_EMAIL_FULFILLED: {
            return Immutable(state).set('page', "grocery-list");
        }
        default:
            return Immutable(state);
    }
};
