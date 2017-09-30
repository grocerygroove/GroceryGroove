import { setSnackbarMessage } from '../../components/page-actions';
import { toggleSnackbar } from '../../components/page-actions';

export const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';

export const SIGNUP_BY_EMAIL_PENDING = 'SIGNUP_BY_EMAIL_PENDING';
export const SIGNUP_BY_EMAIL_REJECTED = 'SIGNUP_BY_EMAIL_REJECTED';
export const SIGNUP_BY_EMAIL_FULFILLED = 'SIGNUP_BY_EMAIL_FULFILLED';

export const SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD = 'SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD';
export const SIGNUP_CREDENTIAL_TYPE_EMAIL = 'SIGNUP_CREDENTIAL_TYPE_EMAIL';
export const SIGNUP_CREDENTIAL_TYPE_PASSWORD = 'SIGNUP_CREDENTIAL_TYPE_PASSWORD';
export const SIGNUP_CREDENTIAL_NICKNAME = 'SIGNUP_CREDENTIAL_TYPE_NICKNAME';
export const SIGNUP_CREDENTIAL_CHANGE = 'SIGNUP_CREDENTIAL_CHANGE';


export const SIGNUP_VALIDATION_ERROR = 'SIGNUP_VALIDATION_ERROR';
export const CLEAR_SIGNUP_ERROR_IF_EXISTS = 'CLEAR_SIGNUP_ERROR_IF_EXISTS';

export function toggleSignupDialog() {
  return {
    type: TOGGLE_SIGNUP_DIALOG,
  };
}

export const signupByEmail = (email, nickname, password) =>
  async (dispatch, getState, { api }) => {
    dispatch(signupByEmailPending());

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

export function signupByEmailPending() {
  return {
    type: SIGNUP_BY_EMAIL_PENDING,
  };
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



export function signupValidationError(errorName) {
  return {
    type: SIGNUP_VALIDATION_ERROR,
    payload: errorName,
  };
}

export function clearSignupErrorIfExists(errorName) {
  return {
    type: CLEAR_SIGNUP_ERROR_IF_EXISTS,
    payload: errorName,
  };
}

export function signupCredentialChange(credentialType, newValue) {
  return {
    type: SIGNUP_CREDENTIAL_CHANGE,
    payload: {
      type: credentialType,
      newValue,
    },
  };
}
