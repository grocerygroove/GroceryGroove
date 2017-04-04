export const CHANGE_PAGE = 'CHANGE_PAGE';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export function changePageAndToggleDrawer(pageName, pageTitle) {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            return resolve(dispatch(changePage(pageName, pageTitle)));
        }).then(()=> {            
            dispatch(toggleDrawer());            
        });        
    }
}



export function changePage(pageName, pageTitle) {
    return {
        type: CHANGE_PAGE,
        payload: {
            pageName,
            pageTitle,
        },
    };
}

export function toggleDrawer() {
    return {
        type: TOGGLE_DRAWER,
    };
}
