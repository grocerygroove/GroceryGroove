import { getGroceryListItems } from '../../grocery-lists-actions';
import { setSnackbarMessage } from '../../../../components/page-actions';
import { toggleSnackbar } from '../../../../components/page-actions';


export const TOGGLE_ADD_ITEM_DIALOG = "TOGGLE_ADD_ITEM_DIALOG";

export function toggleAddItemDialog() {
  return {
    type: TOGGLE_ADD_ITEM_DIALOG,
  };
}


export const ADD_ITEM_FULFILLED = "ADD_ITEM_FULFILLED";

export const addItem = (
  token,
  householdId,
  groceryListId,
  name, 
  categoryId, 
  quantityTypeId, 
  quantity) => 
  async (dispatch, getState, { api }) => {
    console.log(JSON.stringify({
      token,
      householdId,
      groceryListId,
      name,
      categoryId,
      quantityTypeId,
      quantity
    }, null, 2));

    let response;
    try{
      const client = await api();
      response = await client['grocery-lists'].post_grocery_lists_id_item({
        token,
        "household_id": householdId,
        id: groceryListId,
        "bodyparam-grocery-lists-{id}-itempost": {
          "item_name": name,
          "category_id": categoryId,
          "quantity_type_id": quantityTypeId,
          quantity,
        },
      });
    } catch (error) {
      throw error;
    }
    dispatch(toggleAddItemDialog());
    dispatch(getGroceryListItems(token, householdId, groceryListId));
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
