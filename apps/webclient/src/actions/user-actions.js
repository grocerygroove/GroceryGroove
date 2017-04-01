export const GET_HOUSEHOLDS = 'GET_HOUSEHOLDS';
export const GET_HOUSEHOLDS_FULFILLED = 'GET_HOUSEHOLDS_FULFILLED';
export const GET_HOUSEHOLDS_PENDING = 'GET_HOUSEHOLDS_PENDING';
export const GET_HOUSEHOLDS_REJECTED = 'GET_HOUSEHOLDS_REJECTED';


export function getHouseholds(token) {
    return (dispatch, getState, { api }) => {
        console.log("Got to getHouseholds");
        dispatch(getHouseholdsPending());
        return api().then(client => {
            return client.users.get_users_households({
                "token": token,
            });
        }).then(
            response => {
                const households = (JSON.parse(response.data)).households;
                dispatch(getHouseholdsFulfilled(households));
            },
            error => {
                dispatch(getHouseholdsRejected(error));
            }
        ).catch(e => {
            console.log(e);
        });
    };
}

export function getHouseholdsPending() {
    console.log("Get Households Pending dispatched");
    return {
        type: GET_HOUSEHOLDS_PENDING,
    };
}

export function getHouseholdsRejected(message) {
    console.log(`rejected: ${message}`);
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
