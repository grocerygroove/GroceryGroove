import routes from '../routes';
import { changeHash } from '../utils/hash-router';

export const CHANGE_PAGE = 'CHANGE_PAGE';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const HASH_CHANGE = 'HASH_CHANGE';

export function changePageAndToggleDrawer(pageName) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      return resolve(changeHash(pageName));
    }).then(()=> {            
      dispatch(toggleDrawer());            
    });        
  }
}

export function changePage(pageName) {
  return {
    type: CHANGE_PAGE,
    payload: {
      pageName,
    },
  };
}

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
