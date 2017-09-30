export const GET_GROCERY_LISTS_PENDING = 'GET_GROCERY_LISTS_PENDING';
export const GET_GROCERY_LISTS_REJECTED = 'GET_GROCERY_LISTS_REJECTED';
export const GET_GROCERY_LISTS_FULFILLED = 'GET_GROCERY_LISTS_FULFILLED';

export const getGroceryLists = (token, householdId) =>
  async (dispatch, getState, { api }) => {

    dispatch(getGroceryListsPending());

    let response;

    try {
      const client = await api();
      response = await client['grocery-lists'].get_grocery_lists({
        "token": token,
        "household_id": householdId,
      });

    } catch (err) {
      dispatch(getGroceryListsRejected("failed"));
      throw err;
    }
    const groceryLists = (JSON.parse(response.data)).grocery_lists;
    dispatch(getGroceryListsFulfilled(groceryLists));
    dispatch(setLastChecked());
  }

export function getGroceryListsPending() {
  return {
    type: GET_GROCERY_LISTS_PENDING,
  };
}

export function getGroceryListsRejected(message) {
  return {
    type: GET_GROCERY_LISTS_REJECTED,
  };
}

export function getGroceryListsFulfilled(groceryLists) {
  return {
    type: GET_GROCERY_LISTS_FULFILLED,
    payload: groceryLists,
  };
}

export const SET_LAST_CHECKED = 'SET_LAST_CHECKED';

export function setLastChecked() {
  return {
    type: SET_LAST_CHECKED,
    payload: new Date(),
  };
}

export const SET_SELECTED_GROCERY_LIST = 'SET_SELECTED_GROCERY_LIST';

export function setSelectedGroceryList(id) {
  return {
    type: SET_SELECTED_GROCERY_LIST,
    payload: id,
  };
}
