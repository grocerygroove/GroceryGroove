import Immutable from 'immutable';
export default Immutable.fromJS({
    signup: {
        signupDialogVisible: false,
    },
    navigation: {
        page: "login",
        pageTitle: "Login",
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
