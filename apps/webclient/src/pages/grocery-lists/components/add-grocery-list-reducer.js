import { CHANGE_GROCERY_LIST_NAME } from './add-grocery-list-actions';
import { TOGGLE_ADD_GROCERY_LIST_DIALOG } from './add-grocery-list-actions';
import Immutable from 'immutable';

export default function addGroceryListReducer(
  state = Immutable.fromJS({
    name: "",
    visible: false,
  }), action) {

  switch (action.type) {
    case TOGGLE_ADD_GROCERY_LIST_DIALOG: {
      return state.update('visible', 
        prevState => !prevState);
    }
    case CHANGE_GROCERY_LIST_NAME: {
      return state.set('name',
        action.payload);
    }
    default: {
      return state;
    }
  }
}
