export const CHANGE_PAGE = 'CHANGE_PAGE';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';


export function changePage(pageName) {
    return {
        type: CHANGE_PAGE,
        payload: pageName,
    };
}

export function toggleDrawer() {
    return {
        type: TOGGLE_DRAWER,
    };
}
