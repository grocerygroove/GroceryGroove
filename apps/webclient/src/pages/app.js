import React, { PropTypes } from 'react';
import renderIf from 'render-if';
import { connect } from 'react-redux';
import RouterComponent from './pageRouter';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ListIcon from 'material-ui/svg-icons/action/list';
import SignoutIcon from 'material-ui/svg-icons/action/input';
import { white } from 'material-ui/styles/colors';

const { changePage, toggleDrawer } = require('../actions/navigation_actions');

const style = {
    menuItem: {
        backgroundColor: white,
    },
};

const AppComponent = ({
        drawerOpen,
        page,
        changePage,
        toggleDrawer,
    }) => {
    return (
<div>
    {renderIf(page !== "login") (
    <AppBar
        title="Grocery List"
        onLeftIconButtonTouchTap={toggleDrawer}/>
    )}
    <Drawer
        open={drawerOpen}
        docked={false}
        onRequestChange={toggleDrawer}>
        <MenuItem
            onTouchTap={changePage.bind(null, "grocery-list")}
            style={style.menuItem}
            leftIcon={<ListIcon />}>Grocery List</MenuItem>
        <MenuItem
            onTouchTap={changePage.bind(null, "login")}
            style={style.menuItem}
            leftIcon={<SignoutIcon />}>Signout</MenuItem>
    </Drawer>
    <RouterComponent />
</div>
    );
};

AppComponent.propTypes = {
    drawerOpen: PropTypes.bool.isRequired,
    page: PropTypes.string.isRequired,
    changePage: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        drawerOpen: state.navigation.drawerOpen,
        page: state.navigation.page,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        changePage: (pagename) => {
            dispatch(changePage(pagename));
            dispatch(toggleDrawer());
        },
        toggleDrawer: () => {
            dispatch(toggleDrawer());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppComponent);
