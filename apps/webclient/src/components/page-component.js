import AppBar from './generic/appbar/AppBar';
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
import { PropTypes } from 'react';
import React from 'react'; 
import renderIf from 'render-if';
import SignoutIcon from 'material-ui/svg-icons/action/input';
import { toggleDrawer } from './navigation-actions';


const style = {
  menuItem: {
    backgroundColor: 'white',
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
  return (
    <div>        
      {renderIf(page !== "login") (
        <AppBar
          text={pageTitle}
          onButtonClick={toggleDrawer}/>
      )}
      <Drawer
        open={drawerOpen}
        docked={false}
        onRequestChange={toggleDrawer}>
        <MenuItem
          onTouchTap={changePageAndToggleDrawer.bind(null, "grocery-list")}
          style={style.menuItem}
          leftIcon={<ListIcon />}>Grocery List</MenuItem>
        <MenuItem
          onTouchTap={changePageAndToggleDrawer.bind(null, "settings")}
          style={style.menuItem}
          leftIcon={<ListIcon />}>Settings</MenuItem>
        <MenuItem
          onTouchTap={doSignout}
          style={style.menuItem}
          leftIcon={<SignoutIcon />}>Signout</MenuItem>
      </Drawer>        
      <div
        id="page-content-view"
        style={styleOverride ? styleOverride.pageview : {}}>
        {children}
      </div>
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
