import { connect } from 'react-redux';
import GroceryListComponent from '../pages/grocery-list/grocery-list';
import { listenForHashChange } from '../utils/hash-router';
import LoginComponent from '../pages/login/login';
import { PropTypes } from 'react';
import SettingsComponent from '../pages/settings/settings';
import React from 'react';

const RouterComponent = ({
  page,
  boundListenForHashChange,
}) => {

  boundListenForHashChange();

  switch (page) {
    case "login":
      return <LoginComponent />;
    case "grocery-list":
      return <GroceryListComponent />;
    case "settings":
      return <SettingsComponent />;
    default:
      throw new Error("Page Not Found");
  }
};

RouterComponent.propTypes = {
  page: PropTypes.string,    
  boundListenForHashChange: PropTypes.func.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    page: state.getIn([ 'navigation', 'page' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    boundListenForHashChange: listenForHashChange.bind(null, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouterComponent);
