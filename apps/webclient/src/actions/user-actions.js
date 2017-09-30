export const GET_HOUSEHOLDS_FULFILLED = 'GET_HOUSEHOLDS_FULFILLED';
export const GET_HOUSEHOLDS_PENDING = 'GET_HOUSEHOLDS_PENDING';
export const GET_HOUSEHOLDS_REJECTED = 'GET_HOUSEHOLDS_REJECTED';


export const getHouseholds = (token) => 
  async (dispatch, getState, { api }) => {
    dispatch(getHouseholdsPending());

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
    dispatch(getHouseholdsFulfilled(households));
  }

export function getHouseholdsPending() {
  return {
    type: GET_HOUSEHOLDS_PENDING,
  };
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
