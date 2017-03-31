import Immutable from 'immutable';
import { CHANGE_PAGE, TOGGLE_DRAWER } from '../actions/navigation_actions';
import { LOGIN_BY_EMAIL_FULFILLED } from '../pages/login/login_actions';

export default function nagivationReducer(state = Immutable.fromJS({ drawerOpen: false }), action) {
    switch (action.type) {
        case CHANGE_PAGE: {
            return state
                    .set('page', action.payload.pageName)
                    .set('pageTitle', action.payload.pageTitle);
        }
        case TOGGLE_DRAWER: {
            return state
                    .update('drawerOpen', prevState => !prevState);
        }
        case LOGIN_BY_EMAIL_FULFILLED: {
            return state
                    .set('page', "grocery-list")
                    .set('pageTitle', "Grocery List");
        }
        default:
            return state;
    }
}
