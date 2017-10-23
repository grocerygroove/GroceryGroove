export const GET_GROCERY_LISTS_FULFILLED = 'GET_GROCERY_LISTS_FULFILLED';

export const getGroceryLists = (token, householdId) =>
  async (dispatch, getState, { api }) => {

    let response;

    try {
      const client = await api();
      console.log(Object.keys(client['grocery-lists']));
      response = await client['grocery-lists'].get_grocery_lists({
        "token": token,
        "household_id": householdId,
      });

    } catch (err) {
      throw err;
    }
    const groceryLists = (JSON.parse(response.data)).grocery_lists;
    dispatch(getGroceryListsFulfilled(groceryLists));
    dispatch(setLastChecked());
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

export const setSelectedGroceryList = (token, householdId, id) => 
  async (dispatch, getState, { api }) => {
    dispatch({
      type: SET_SELECTED_GROCERY_LIST,
      payload: id,
    });
    await dispatch(getGroceryListItems(token, householdId, id));
  }

export const GET_GROCERY_LIST_ITEMS_FULFILLED = 'GET_GROCERY_LIST_ITEMS_FULFILLED';

export const getGroceryListItems = (token, householdId, groceryListId) =>
  async (dispatch, getState, { api }) => {

    let response;

    try {
      const client = await api();
      response = await client['grocery-lists'].get_grocery_lists_id_items({
        "token": token,
        "household_id": householdId,
        "id": groceryListId,
      });

    } catch (err) {
      throw err;
    }
    const groceryListItems = (JSON.parse(response.data)).grocery_list_items;
    dispatch(getGroceryListItemsFulfilled(groceryListItems));
  }

export function getGroceryListItemsFulfilled(groceryListItems) {
  return {
    type: GET_GROCERY_LIST_ITEMS_FULFILLED,
    payload: groceryListItems,
  };
}

export const updateGroceryListItem = (
  token, 
  householdId, 
  groceryListId, 
  groceryListItemId, 
  {
    itemName,
    categoryId,
    quantityTypeId,
    quantity,
    checked,
    purchased,
    unitCost,
  }) => 
  async (dispatch, getState, { api }) => {
    let response;

    try {
      const client = await api();
      response = await client['grocery-lists'].put_grocery_lists_id_item({
        token,
        "household_id": householdId,
        "id": groceryListId,
        "bodyparam-grocery-lists-{id}-itemput": {
          "item_id": groceryListItemId,
          "item_name": itemName,
          "category_id": categoryId,
          "quantity_type_id": quantityTypeId,
          quantity,
          checked,
          purchased,
          "unit_cost": unitCost,
        },
      });
    } catch (err) {
      throw err;
    }
    if (response.obj.item_updated === true) {
      dispatch(getGroceryListItems(token, householdId, groceryListId));
    }
  }

export const setGroceryListItemChecked = (
  token, 
  householdId, 
  groceryListId, 
  groceryListItemId, 
  checked,
) =>
  async (dispatch, getState, { api }) => {
    dispatch(updateGroceryListItem(
      token, 
      householdId, 
      groceryListId, 
      groceryListItemId, 
      {
        checked,
      }
    ));
  }
