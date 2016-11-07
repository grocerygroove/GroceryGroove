import Immutable from 'immutable';
module.exports = Immutable.fromJS({
    signup: {
        signupDialogVisible: false,
    },
    navigation: {
        page: "login",
        drawerOpen: false,
    },
    login: {
        snackbar: {
            open: false,
            message: "",
        },
        loginCreds: {
            email: "",
            password: "",
        },
    },
});
