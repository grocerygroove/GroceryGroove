export const GET_QUANTITY_TYPES_FULFILLED = 'GET_QUANTITY_TYPES_FULFILLED';
export const GET_QUANTITY_TYPES_PENDING = 'GET_QUANTITY_TYPES_PENDING';
export const GET_QUANTITY_TYPES_REJECTED = 'GET_QUANTITY_TYPES_REJECTED';

export const getQuantityTypes = (token, householdId) =>
  async (dispatch, getState, { api }) => {
    dispatch(getQuantityTypesPending());

    let response;
    try {
      const client = await api();
      response = await client['quantity-types'].get_quantity_types({
        "token": token,
        "household_id": householdId,
      });
    } catch (error) {
      dispatch(getQuantityTypesRejected(error));
      throw error;
    }
    const quantity_types = (JSON.parse(response.data)).quantity_types;
    dispatch(getQuantityTypesFulfilled(quantity_types));
  }

export function getQuantityTypesPending() {
  return {
    type: GET_QUANTITY_TYPES_PENDING,
  };
}

export function getQuantityTypesRejected(message) {
  return {
    type: GET_QUANTITY_TYPES_REJECTED,
  };
}

export function getQuantityTypesFulfilled(quantity_types) {
  return {
    type: GET_QUANTITY_TYPES_FULFILLED,
    payload: quantity_types,
  };
}
