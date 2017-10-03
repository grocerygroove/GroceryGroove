import { fromJS } from 'immutable';

export default fromJS({
  login: {
    state: {
      loginCreds: {
        email: "",
        password: "",
      },
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
  groceryLists: {
  },
});
