const CHANGE_PAGE = 'CHANGE_PAGE';
const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

module.exports = {
    CHANGE_PAGE,
    changePage: function (pageName) {
        return {
            type: CHANGE_PAGE,
            payload: pageName,
        };
    },
    TOGGLE_DRAWER,
    toggleDrawer: function() {
        return {
            type: TOGGLE_DRAWER,
        };
    },
};
