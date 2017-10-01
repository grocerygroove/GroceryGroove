import { setSnackbarMessage } from '../../../components/page-actions';
import { toggleSnackbar } from '../../../components/page-actions';

export const ADD_ITEM_NAME_CREDENTIAL = "ADD_ITEM_NAME_CREDENTIAL";
export const ADD_ITEM_DESCRIPTION_CREDENTIAL = "ADD_ITEM_DESCRIPTION_CREDENTIAL";
export const ADD_ITEM_CATEGORY_CREDENTIAL = "ADD_ITEM_CATEGORY_CREDENTIAL";
export const ADD_ITEM_QUANTITY_TYPE_CREDENTIAL = "ADD_ITEM_QUANTITY_TYPE_CREDENTIAL";
export const ADD_ITEM_QUANTITY_CREDENTIAL = "ADD_ITEM_QUANTITY_CREDENTIAL";

export const ADD_ITEM_CREDENTIAL_CHANGE = "ADD_ITEM_CREDENTIAL_CHANGE";

export function addItemCredentialChange(credentialType, newValue) {
  return {
    type: ADD_ITEM_CREDENTIAL_CHANGE,
    payload: {
      type: credentialType,
      newValue,
    },
  };
};

export const TOGGLE_ADD_ITEM_DIALOG = "TOGGLE_ADD_ITEM_DIALOG";

export function toggleAddItemDialog() {
  return {
    type: TOGGLE_ADD_ITEM_DIALOG,
  };
}


export const ADD_ITEM_PENDING = "ADD_ITEM_PENDING";
export const ADD_ITEM_FULFILLED = "ADD_ITEM_FULFILLED";
export const ADD_ITEM_REJECTED = "ADD_ITEM_REJECTED";

export const addItem = (name, description, categoryId, quantityTypeId, quantity) =>
  async (dispatch, getState, { api }) => {
    dispatch(addItemPending());

    let response;
    try{
      const client = await api();
      response = await client['grocery-lists'].post_grocery_lists_item({

      });
    } catch (error) {
      const rejectionExplaination = JSON.parse(error.statusText);
      dispatch(addItemRejected(rejectionExplaination));
      throw error;
    }
    dispatch(toggleAddItemDialog());
    dispatch(setSnackbarMessage("Item Added Successfully"));
    dispatch(toggleSnackbar());
    dispatch(addItemFulfilled());
  }

export function addItemPending() {
  return {
    type: ADD_ITEM_PENDING,
  };
}
export function addItemRejected(message) {
  return {
    type: ADD_ITEM_REJECTED,
    payload: message,
  };
}
export function addItemFulfilled(itemId) {
  return {
    type: ADD_ITEM_FULFILLED,
    payload: itemId,
  };
}
