const { CHANGE_PAGE, TOGGLE_DRAWER } = require('../actions/navigation_actions');

module.exports = function nagivationReducer(state = { drawerOpen: false }, action) {
    switch (action.type) {
        case CHANGE_PAGE: {
            return Object.assign({}, state, {
                page: action.payload,
            });
        }
        case TOGGLE_DRAWER: {
            return Object.assign({}, state, {
                drawerOpen: !state.drawerOpen,
            });
        }
        default:
            return state;
    }
};
