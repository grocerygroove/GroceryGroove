import AppBar from './generic/appbar/AppBar';
import IconButton from './generic/button/IconButton';
import { changePageAndToggleDrawer } from './page-actions';
import { changeHash } from '../utils/hash-router';
import { clear } from "redux-localstorage-simple";
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import initalState from '../initial-state';
import NavDrawer from './generic/navdrawer/NavDrawer';
import MdList from 'react-icons/lib/md/list';
import mergeDeep from 'immutable';
import PropTypes from 'prop-types';
import React from 'react'; 
import SignoutIcon from 'react-icons/lib/md/input';
import SnackBar from './generic/snackbar/SnackBar';
import { toggleDrawer } from './page-actions';
import { toggleSnackbar } from './page-actions';


const style = {
  menuItem: {
    backgroundColor: 'white',
  },
};

const PageComponent = ({
  pageTitle,
  headerRightElement,
  styleOverride,
  children,
  snackbarOpen,
  snackbarMessage,
  drawerOpen, 
  page,
  toggleSnackbar,
  changePageAndToggleDrawer,
  toggleDrawer,
  doSignout,
}) => {
  return (
    <div>        
      {  page !== "login" &&
        <AppBar
          text={pageTitle}
          onButtonClick={toggleDrawer}
          headerRightElement={headerRightElement}/>
      }
      <NavDrawer
        open={drawerOpen}
        onOutClick={toggleDrawer}>
        <IconButton
          text="Grocery List"
          classNames={["drawer-button"]}
          onClick={changePageAndToggleDrawer.bind(null, "grocery-list")}>
          <MdList />
        </IconButton>
        <IconButton
          text="Settings"
          classNames={["drawer-button"]}
          onClick={changePageAndToggleDrawer.bind(null, "settings")}>
          <MdList />
        </IconButton>
        <IconButton
          text="Signout"
          classNames={["drawer-button"]}
          onClick={doSignout}>
          <SignoutIcon />
        </IconButton>
      </NavDrawer>
      <div
        id="page-content-view"
        style={styleOverride ? styleOverride.pageview : {}}>
        {children}
        <SnackBar
          show={snackbarOpen}
          text={snackbarMessage}
          onRequestClose={toggleSnackbar.bind(null, false)}
        />
      </div>
    </div>
  );
};

PageComponent.propTypes = {
  pageTitle: PropTypes.string,
  headerRightElement: PropTypes.element,
  styleOverride: PropTypes.object,
  children: PropTypes.element,
  snackbarOpen: PropTypes.bool.isRequired,
  snackbarMessage: PropTypes.string,
  drawerOpen: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired,    
  changePageAndToggleDrawer: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  doSignout: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    snackbarOpen: state.getIn([ 'page', 'snackbar', 'open' ]),
    snackbarMessage: state.getIn([ 'page', 'snackbar', 'message' ]),
    drawerOpen: state.getIn([ 'page', 'drawerOpen' ]),
    page: state.getIn([ 'page', 'page' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (display) => {
      dispatch(toggleSnackbar(display));
    },
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
