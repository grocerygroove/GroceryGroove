import { TOGGLE_ADD_ITEM_DIALOG } from './add-item-actions';
import Immutable from 'immutable';

export default function addItemReducer(
  state = Immutable.fromJS({
    visible: false,
  }), action) {
  switch (action.type) {

    case TOGGLE_ADD_ITEM_DIALOG: {
      return state
        .update('visible', prevState => !prevState);
    }
    default: {
      return state;
    }
  }
}
