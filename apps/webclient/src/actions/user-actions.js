import { getCategories } from './categories-actions';
import { getQuantityTypes } from './quantity-types-actions';
export const GET_HOUSEHOLDS_FULFILLED = 'GET_HOUSEHOLDS_FULFILLED';
export const GET_HOUSEHOLDS_REJECTED = 'GET_HOUSEHOLDS_REJECTED';


export const getHouseholds = (token) => 
  async (dispatch, getState, { api }) => {

    let response;
    try {
      const client = await api();
      response = await client.users.get_users_households({
        "token": token,
      }); 
    } catch(error) {
      dispatch(getHouseholdsRejected(error));
      throw error;
    }
    const households = (JSON.parse(response.data)).households;
    await (dispatch(setSelectedHousehold(token, households[0])));
    dispatch(getHouseholdsFulfilled(households));
  }


export function getHouseholdsRejected(message) {
  return {
    type: GET_HOUSEHOLDS_REJECTED,
  };
}

export function getHouseholdsFulfilled(households) {
  return {
    type: GET_HOUSEHOLDS_FULFILLED,
    payload: households,
  };
}

export const SET_SELECTED_HOUSEHOLD = 'SET_SELECTED_HOUSEHOLD';

export const setSelectedHousehold = (token, householdId) =>
  async (dispatch, getState, { api }) => {
    dispatch({
      type: SET_SELECTED_HOUSEHOLD,
      payload: householdId,
    });
    await dispatch(getCategories(token, householdId));
    await dispatch(getQuantityTypes(token, householdId));
    return;
  }
