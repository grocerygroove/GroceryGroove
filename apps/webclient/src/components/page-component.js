import AppBar from 'material-ui/AppBar';
import { changePageAndToggleDrawer } from './navigation-actions';
import { changeHash } from '../utils/hash-router';
import { clear } from "redux-localstorage-simple";
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import { fromJS } from 'immutable';
import ListIcon from 'material-ui/svg-icons/action/list';
import initalState from '../initial-state';
import MenuItem from 'material-ui/MenuItem';
import mergeDeep from 'immutable';
import Paper from 'material-ui/Paper';
import { PropTypes } from 'react';
import React from 'react'; 
import renderIf from 'render-if';
import SignoutIcon from 'material-ui/svg-icons/action/input';
import { toggleDrawer } from './navigation-actions';
import { white } from 'material-ui/styles/colors';


const style = {
    paper: {
        height: 'calc(100vh - 64px)', //The app bar is 64px tall
        width: '100%', //want all content divs to fill width
    },
    menuItem: {
        backgroundColor: white,
    },
};

const PageComponent = ({
    pageTitle,
    styleOverride,
    children,
    drawerOpen,
    page,
    changePageAndToggleDrawer,
    toggleDrawer,
    doSignout,
}) => {
    const computedStyle = fromJS(style).mergeDeep(styleOverride).toJS();
    return (
<div>        
    {renderIf(page !== "login") (
    <AppBar
        title={pageTitle}
        onLeftIconButtonTouchTap={toggleDrawer}
        style={computedStyle.appBar}/>
    )}
    <Drawer
        open={drawerOpen}
        docked={false}
        onRequestChange={toggleDrawer}>
        <MenuItem
            onTouchTap={changePageAndToggleDrawer.bind(null, "grocery-list")}
            style={computedStyle.menuItem}
            leftIcon={<ListIcon />}>Grocery List</MenuItem>
        <MenuItem
            onTouchTap={changePageAndToggleDrawer.bind(null, "categories")}
            style={computedStyle.menuItem}
            leftIcon={<ListIcon />}>Categories</MenuItem>
        <MenuItem
            onTouchTap={doSignout}
            style={computedStyle.menuItem}
            leftIcon={<SignoutIcon />}>Signout</MenuItem>
    </Drawer>        
    <Paper
        style={computedStyle.paper}
        zDepth={1}>
        {children}
    </Paper>
</div>
    );
};

PageComponent.propTypes = {
    pageTitle: PropTypes.string,
    styleOverride: PropTypes.object,
    children: PropTypes.element,
    drawerOpen: PropTypes.bool.isRequired,
    page: PropTypes.string.isRequired,    
    changePageAndToggleDrawer: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    doSignout: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        drawerOpen: state.getIn([ 'navigation', 'drawerOpen' ]),
        page: state.getIn([ 'navigation', 'page' ]),
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        changePageAndToggleDrawer: (pagename) => {
            dispatch(changePageAndToggleDrawer(pagename));
        },
        toggleDrawer: () => {
            dispatch(toggleDrawer());
        },
        doSignout: () => {
            //Clear local storage
            clear();
            //Reset store to intial state with redux-reset middleware
            dispatch({
                type: 'RESET',
                state: initalState, // Will use this as new initial state
            });
            changeHash('login');
        },
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageComponent);
