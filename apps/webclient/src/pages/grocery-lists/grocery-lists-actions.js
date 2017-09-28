export const GET_GROCERY_LISTS_PENDING = 'GET_GROCERY_LISTS_PENDING';
export const GET_GROCERY_LISTS_REJECTED = 'GET_GROCERY_LISTS_REJECTED';
export const GET_GROCERY_LISTS_FULFILLED = 'GET_GROCERY_LISTS_FULFILLED';

export function getGroceryLists(token, householdId) {
  return (dispatch, getState, { api }) => {
    dispatch(getGroceryListsPending());
    return api().then(client => {
      return client['grocery-lists'].get_grocery_lists({
        "token": token,
        "household_id": householdId,
      });
    }).then(
      response => {
        const groceryLists = (JSON.parse(response.data)).grocery_lists;
        dispatch(getGroceryListsFulfilled(groceryLists));
      },
      error => {
        dispatch(getGroceryListsRejected("failed"));
      }
    );
  };
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
