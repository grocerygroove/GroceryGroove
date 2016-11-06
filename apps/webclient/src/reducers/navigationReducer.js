const Immutable = require("seamless-immutable");
const { CHANGE_PAGE, TOGGLE_DRAWER } = require('../actions/navigation_actions');

module.exports = function nagivationReducer(state = { drawerOpen: false }, action) {
    switch (action.type) {
        case CHANGE_PAGE: {
            return Immutable(state).set('page', action.payload);
        }
        case TOGGLE_DRAWER: {
            return Immutable(state)
                .update('drawerOpen', (prevState) => { return !prevState; });
        }
        default:
            return Immutable(state);
    }
};
