import { getGroceryLists } from '../../grocery-lists-actions';
import { setSelectedGroceryList } from '../../grocery-lists-actions';
import { setSnackbarMessage } from '../../../../components/page-actions';
import { toggleSnackbar } from '../../../../components/page-actions';

export const CREATE_GROCERY_LIST_FULFILLED = "CREATE_GROCERY_LIST_FULFILLED";

export const createGroceryList = (token, householdId, groceryListName) => 
  async (dispatch, getState, { api }) => {

    let response;

    try {
      const client = await api();
      response = await client['grocery-lists'].post_grocery_lists({
        "token": token,
        "household_id": householdId,
        "bodyparam-grocery-listspost": {
          "name": groceryListName,
        },
      });

    } catch (err) {
      dispatch(setSnackbarMessage("Add Grocery List Failed"));
      dispatch(toggleSnackbar());
      throw err;
    }
    const groceryListId = parseInt((JSON.parse(response.data)).grocery_list_id);
    await dispatch(getGroceryLists(token, householdId));
    dispatch(toggleAddGroceryListDialog());
    dispatch(setSelectedGroceryList(groceryListId));
    dispatch(setSnackbarMessage("Grocery List Added"));
    dispatch(toggleSnackbar());

    dispatch(createGroceryListFulfilled(groceryListId));
  }

export function createGroceryListFulfilled(groceryListId) {
  return {
    type: CREATE_GROCERY_LIST_FULFILLED,
    payload: groceryListId,
  };
}

export const TOGGLE_ADD_GROCERY_LIST_DIALOG = "TOGGLE_ADD_GROCERY_LIST_DIALOG";

export const toggleAddGroceryListDialog = () => {
  return {
    type: TOGGLE_ADD_GROCERY_LIST_DIALOG,
  };
}
