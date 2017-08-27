import AppBar from './generic/appbar/AppBar';
import Button from './generic/button/Button';
import { changePageAndToggleDrawer } from './navigation-actions';
import { changeHash } from '../utils/hash-router';
import { clear } from "redux-localstorage-simple";
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import initalState from '../initial-state';
import NavDrawer from './generic/navdrawer/NavDrawer';
import MdList from 'react-icons/lib/md/list';
import mergeDeep from 'immutable';
import { PropTypes } from 'react';
import React from 'react'; 
import renderIf from 'render-if';
import SignoutIcon from 'react-icons/lib/md/input';
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
      <NavDrawer
        open={drawerOpen}
        onOutClick={toggleDrawer}>
        <Button
          text="Grocery List"
          className="drawer-button"
          onClick={changePageAndToggleDrawer.bind(null, "grocery-list")}>
          <MdList />
        </Button>
        <Button
          text="Settings"
          className="drawer-button"
          onClick={changePageAndToggleDrawer.bind(null, "settings")}>
          <MdList />
        </Button>
        <Button
          text="Signout"
          className="drawer-button"
          onClick={doSignout}>
          <SignoutIcon />
        </Button>
      </NavDrawer>
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
