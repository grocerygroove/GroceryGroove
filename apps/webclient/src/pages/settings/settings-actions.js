export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_CATEGORIES_FULFILLED = 'GET_CATEGORIES_FULFILLED';
export const GET_CATEGORIES_PENDING = 'GET_CATEGORIES_PENDING';
export const GET_CATEGORIES_REJECTED = 'GET_CATEGORIES_REJECTED';

export function getCategories(token, householdId) {
  return (dispatch, getState, { api }) => {
    dispatch(getCategoriesPending());
    return api().then(client => {
      return client.categories.get_categories({
        "token": token,
        "household_id": householdId,
      });
    }).then(
      response => {
        const categories = (JSON.parse(response.data)).category_names;
        dispatch(getCategoriesFulfilled(categories));
      },
      error => {
        dispatch(getCategoriesRejected("failed"));
      }
    );
  };
}

export function getCategoriesPending() {
  return {
    type: GET_CATEGORIES_PENDING,
  };
}

export function getCategoriesRejected(message) {
  return {
    type: GET_CATEGORIES_REJECTED,
  };
}

export function getCategoriesFulfilled(categories) {
  return {
    type: GET_CATEGORIES_FULFILLED,
    payload: categories,
  };
}
