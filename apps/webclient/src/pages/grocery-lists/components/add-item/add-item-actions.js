import { setSnackbarMessage } from '../../../../components/page-actions';
import { toggleSnackbar } from '../../../../components/page-actions';


export const TOGGLE_ADD_ITEM_DIALOG = "TOGGLE_ADD_ITEM_DIALOG";

export function toggleAddItemDialog() {
  return {
    type: TOGGLE_ADD_ITEM_DIALOG,
  };
}


export const ADD_ITEM_FULFILLED = "ADD_ITEM_FULFILLED";

export const addItem = (name, categoryId, quantityTypeId, quantity) =>
  async (dispatch, getState, { api }) => {

    let response;
    try{
      const client = await api();
      response = await client['grocery-lists'].post_grocery_lists_item({

      });
    } catch (error) {
      const rejectionExplaination = JSON.parse(error.statusText);
      throw error;
    }
    dispatch(toggleAddItemDialog());
    dispatch(setSnackbarMessage("Item Added Successfully"));
    dispatch(toggleSnackbar());
    dispatch(addItemFulfilled());
  }

export function addItemFulfilled(itemId) {
  return {
    type: ADD_ITEM_FULFILLED,
    payload: itemId,
  };
}
