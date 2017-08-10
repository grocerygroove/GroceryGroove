import { fromJS } from 'immutable';

export default fromJS({
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
