const { CHANGE_PAGE } = require('../actions/page_actions');

module.exports = function pageReducer(state = "", action) {
    switch (action.type) {
        case CHANGE_PAGE:
            return action.pageName;
        default:
            return state;
    }
};
