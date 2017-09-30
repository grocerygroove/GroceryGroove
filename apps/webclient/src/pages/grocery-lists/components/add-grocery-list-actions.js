import { getGroceryLists } from '../grocery-lists-actions';
import { setSelectedGroceryList } from '../grocery-lists-actions';
import { setSnackbarMessage } from '../../../components/page-actions';
import { toggleSnackbar } from '../../../components/page-actions';

export const CREATE_GROCERY_LIST_PENDING = "CREATE_GROCERY_LIST_PENDING";
export const CREATE_GROCERY_LIST_REJECTED = "CREATE_GROCERY_LIST_REJECTED";
export const CREATE_GROCERY_LIST_FULFILLED = "CREATE_GROCERY_LIST_FULFILLED";

export const createGroceryList = (householdId, token, groceryListName) => 
  async (dispatch, getState, { api }) => {

    dispatch(createGroceryListPending());

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
      dispatch(createGroceryListRejected("failed"));
      throw err;
    }
    const groceryListId = parseInt((JSON.parse(response.data)).grocery_list_id);
    await dispatch(getGroceryLists(token, householdId));
    dispatch(toggleAddGroceryListDialog());
    dispatch(changeGroceryListName(""));
    dispatch(setSelectedGroceryList(groceryListId));
    dispatch(setSnackbarMessage("Grocery List Added"));
    dispatch(toggleSnackbar());

    dispatch(createGroceryListFulfilled(groceryListId));
  }

export function createGroceryListPending() {
  return {
    type: CREATE_GROCERY_LIST_PENDING,
  };
}

export function createGroceryListRejected(message) {
  return {
    type: CREATE_GROCERY_LIST_REJECTED,
  };
}

export function createGroceryListFulfilled(groceryListId) {
  return {
    type: CREATE_GROCERY_LIST_FULFILLED,
    payload: groceryListId,
  };
}

export const CHANGE_GROCERY_LIST_NAME = "CHANGE_GROCERY_LIST_NAME";

export function changeGroceryListName(groceryListName) {
  return {
    type: CHANGE_GROCERY_LIST_NAME,
    payload: groceryListName,
  };
}

export const TOGGLE_ADD_GROCERY_LIST_DIALOG = "TOGGLE_ADD_GROCERY_LIST_DIALOG";

export const toggleAddGroceryListDialog = () => {
  return {
    type: TOGGLE_ADD_GROCERY_LIST_DIALOG,
  };
}
