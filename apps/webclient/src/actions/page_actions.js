const CHANGE_PAGE = 'CHANGE_PAGE';

module.exports = {
    CHANGE_PAGE,
    changePage: function (pageName) {
        return {
            type: CHANGE_PAGE,
            pageName,
        };
    },
};
