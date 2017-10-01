import { TOGGLE_ADD_GROCERY_LIST_DIALOG } from './add-grocery-list-actions';
import Immutable from 'immutable';

export default function addGroceryListReducer(
  state = Immutable.fromJS({
    visible: false,
  }), action) {

  switch (action.type) {
    case TOGGLE_ADD_GROCERY_LIST_DIALOG: {
      return state.update('visible', 
        prevState => !prevState);
    }
    default: {
      return state;
    }
  }
}
