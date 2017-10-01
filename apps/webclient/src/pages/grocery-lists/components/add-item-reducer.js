import { ADD_ITEM_CREDENTIAL_CHANGE } from './add-item-actions';
import { ADD_ITEM_NAME_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_DESCRIPTION_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_CATEGORY_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_QUANTITY_TYPE_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_QUANTITY_CREDENTIAL } from './add-item-actions';
import { TOGGLE_ADD_ITEM_DIALOG } from './add-item-actions';
import Immutable from 'immutable';

export default function addItemReducer(
  state = Immutable.fromJS({
    name: "",
    description: null,
    category: null,
    quantityType: null,
    quantity: 1,
    visible: false,
  }), action) {
  switch (action.type) {

    case ADD_ITEM_CREDENTIAL_CHANGE: {
      if(action.payload.type === ADD_ITEM_NAME_CREDENTIAL) {
        return state.set('name', action.payload.newValue);
      } else if(action.payload.type === ADD_ITEM_DESCRIPTION_CREDENTIAL) {
        return state.set('description', action.payload.newValue);
      } else if(action.payload.type === ADD_ITEM_CATEGORY_CREDENTIAL) {
        return state.set('category', action.payload.newValue);
      } else if(action.payload.type === ADD_ITEM_QUANTITY_TYPE_CREDENTIAL) {
        return state.set('quantityType', action.payload.newValue);
      } else if(action.payload.type === ADD_ITEM_QUANTITY_CREDENTIAL) {
        return state.set('quantity', action.payload.newValue);
      }
    }
    case TOGGLE_ADD_ITEM_DIALOG: {
      return state
        .update('visible', prevState => !prevState);
    }
    default: {
      return state;
    }
  }
}
