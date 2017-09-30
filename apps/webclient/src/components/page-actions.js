import { changeHash } from '../utils/hash-router';
import routes from '../routes';

export const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

export function toggleSnackbar(on) {
  return {
    type: TOGGLE_SNACKBAR,
    payload: on,
  };
}

export const SET_SNACKBAR_MESSAGE = 'SET_SNACKBAR_MESSAGE';

export function setSnackbarMessage(message) {
  return {
    type: SET_SNACKBAR_MESSAGE,
    payload: message,
  };
}


export const HASH_CHANGE = 'HASH_CHANGE';

export const changePageAndToggleDrawer = (pageName) => 
  async (dispatch, getState) => {
    await changeHash(pageName);
    dispatch(toggleDrawer());            
  }

export const CHANGE_PAGE = 'CHANGE_PAGE';

export function changePage(pageName) {
  return {
    type: CHANGE_PAGE,
    payload: {
      pageName,
    },
  };
}

export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export function toggleDrawer() {
  return {
    type: TOGGLE_DRAWER,
  };
}


export function hashChange(hash) {
  if (routes.indexOf(hash) > -1) {
    return {
      type: CHANGE_PAGE,
      payload: {
        pageName: hash,
      },
    }
  } else {
    return {
      type: CHANGE_PAGE,
      payload: {
        pageName: 'login',
      },
    }
  }
}

