import Immutable from 'immutable';
import {
    GET_CATEGORIES_PENDING,
    GET_CATEGORIES_REJECTED,
    GET_CATEGORIES_FULFILLED,
} from './categories-actions';

export default function categoriesReducer(state = Immutable.fromJS([]), action) {
    switch (action.type) {
        case GET_CATEGORIES_FULFILLED: {
            return Immutable.fromJS(action.payload);
        }
        default:
            return state;
    }
}
