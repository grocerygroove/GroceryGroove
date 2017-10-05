import { changeHash } from '../../utils/hash-router';
import { getHouseholds } from '../../actions/user-actions';

export const LOGIN_BY_EMAIL_REJECTED = 'LOGIN_BY_EMAIL_REJECTED';
export const LOGIN_BY_EMAIL_FULFILLED = 'LOGIN_BY_EMAIL_FULFILLED';

export const LOGIN_VALIDATION_ERROR = 'LOGIN_VALIDATION_ERROR';

export const CLEAR_LOGIN_ERROR_IF_EXISTS = 'CLEAR_LOGIN_ERROR_IF_EXISTS';


export const loginByEmail = (email, password) => 
  async (dispatch, getState, { api }) => {

    let response;

    try {
      const client = await api();
      response = await client.login.post_login_by_email({
        "bodyparam-login-by-emailpost": {
          email,
          password,
        },
      });
    } catch(error) {
      const statusText = JSON.parse(error.statusText);
      const returnValue = (statusText && statusText.message) ? statusText.message : void(0);
      dispatch(loginByEmailRejected(returnValue));
      throw error;
    }

    const token = (JSON.parse(response.data)).token;
    dispatch(loginByEmailFulfilled(token));                
    await dispatch(getHouseholds(token));
    changeHash('grocery-list');
  }

export function loginByEmailRejected(message) {
  return {
    type: LOGIN_BY_EMAIL_REJECTED,
    payload: message,
  };
}

export function loginByEmailFulfilled(token) {
  return {
    type: LOGIN_BY_EMAIL_FULFILLED,
    payload: token,
  };
}

export function loginValidationError(errorName) {
  return {
    type: LOGIN_VALIDATION_ERROR,
    payload: errorName,
  };
}

export function clearLoginErrorIfExists(errorName) {
  return {
    type: CLEAR_LOGIN_ERROR_IF_EXISTS,
    payload: errorName,
  };
}
