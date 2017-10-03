import { setSnackbarMessage } from '../../../../components/page-actions';
import { toggleSnackbar } from '../../../../components/page-actions';

export const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';

export const SIGNUP_BY_EMAIL_REJECTED = 'SIGNUP_BY_EMAIL_REJECTED';
export const SIGNUP_BY_EMAIL_FULFILLED = 'SIGNUP_BY_EMAIL_FULFILLED';

export function toggleSignupDialog() {
  return {
    type: TOGGLE_SIGNUP_DIALOG,
  };
}

export const signupByEmail = (email, nickname, password) =>
  async (dispatch, getState, { api }) => {

    let response;

    try {
      const client = await api();
      response = await client.signup.post_signup_by_email({
        "bodyparam-signup-by-emailpost": {
          email,
          nickname,
          password,
        },
      });
    } catch(error) {
      const rejectionExplaination = JSON.parse(error.statusText);
      dispatch(signupByEmailRejected(rejectionExplaination));
      throw error;
    }

    dispatch(signupByEmailFulfilled(response));
    dispatch(setSnackbarMessage("Account Creation Successful"));
    dispatch(toggleSnackbar());
  }


export function signupByEmailRejected(rejectionExplaination) {
  return {
    type: SIGNUP_BY_EMAIL_REJECTED,
    payload: rejectionExplaination,
  };
}

export function signupByEmailFulfilled(response) {
  return {
    type: SIGNUP_BY_EMAIL_FULFILLED,
    payload: response,
  };
}
