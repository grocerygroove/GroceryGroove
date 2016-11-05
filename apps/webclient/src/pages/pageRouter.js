import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginComponent from './login';
import GroceryListComponent from './groceryList';
import NotFoundComponent from './notFound';

const RouterComponent = ({
                page,
                }) => {
    switch (page) {
        case "login":
            return <LoginComponent />;
        case "grocery-list":
            return <GroceryListComponent />;
        default:
            return <NotFoundComponent />;
    }
};

RouterComponent.propTypes = {
    page: PropTypes.string,
};


const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        page: state.navigation.page,
    });
};

export default connect(mapStateToProps)(RouterComponent);
