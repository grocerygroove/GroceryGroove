import { TOGGLE_SNACKBAR } from './page-actions';
import { SET_SNACKBAR_MESSAGE } from './page-actions';
import { CHANGE_PAGE } from './page-actions';
import Immutable from 'immutable';
import { TOGGLE_DRAWER } from './page-actions';

export default function pageReducer(
  state = Immatable.fromJS({}), 
  action
) {
  switch (action.type) {
    case CHANGE_PAGE: {
      return state
        .set('page', action.payload.pageName)
        .set('pageTitle', action.payload.pageTitle);
    }
    case TOGGLE_DRAWER: {
      return state
        .update('drawerOpen', prevState => !prevState);
    }
    case TOGGLE_SNACKBAR: {
      if(typeof(action.payload) != "undefined")
        return state
          .setIn([ 'snackbar', 'open' ], action.payload);
      else
        return state
          .updateIn([ 'snackbar', 'open' ], prevValue => !prevValue);
    }
    case SET_SNACKBAR_MESSAGE: {
      return state
        .setIn([ 'snackbar', 'message' ], action.payload);
    }
    default:
      return state;
  }
}
