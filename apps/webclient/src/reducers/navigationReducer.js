import Immutable from 'immutable';
const { CHANGE_PAGE, TOGGLE_DRAWER } = require('../actions/navigation_actions');
const { LOGIN_BY_EMAIL_FULFILLED } = require('../actions/login_actions');

module.exports = function nagivationReducer(state = Immutable.fromJS({ drawerOpen: false }), action) {
    switch (action.type) {
        case CHANGE_PAGE: {
            return state.set('page', action.payload);
        }
        case TOGGLE_DRAWER: {
            return state
                    .update('drawerOpen', prevState => !prevState);
        }
        case LOGIN_BY_EMAIL_FULFILLED: {
            return state.set('page', "grocery-list");
        }
        default:
            return state;
    }
};
