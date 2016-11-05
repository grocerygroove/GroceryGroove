/*
 * action types
 */
const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

module.exports = {
    TOGGLE_SNACKBAR,
    toggleSnackbar: function() {
        return {
            type: TOGGLE_SNACKBAR,
        };
    },
};
