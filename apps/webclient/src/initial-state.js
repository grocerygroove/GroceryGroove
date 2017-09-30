import { fromJS } from 'immutable';

export default fromJS({
  login: {
    loginCreds: {
      email: "",
      password: "",
    },
  },
  page: {
    page: "login",
    pageTitle: "Login",
    drawerOpen: false,
    snackbar: {
      open: false,
      message: "",
    },
  },
  signup: {
    signupDialogVisible: false,
  },
  groceryLists: {
  },
});
