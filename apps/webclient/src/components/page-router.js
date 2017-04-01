import CategoriesComponent from '../pages/categories/categories';
import { connect } from 'react-redux';
import GroceryListComponent from '../pages/grocery-list/grocery-list';
import LoginComponent from '../pages/login/login';
import { PropTypes } from 'react';
import React from 'react';

const RouterComponent = ({
                page,
                }) => {
    switch (page) {
        case "login":
            return <LoginComponent />;
        case "grocery-list":
            return <GroceryListComponent />;
        case "categories":
            return <CategoriesComponent />;
        default:
            throw new Error("Page Not Found");
    }
};

RouterComponent.propTypes = {
    page: PropTypes.string,    
};


const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        page: state.getIn([ 'navigation', 'page' ]),
    });
};

export default connect(
    mapStateToProps
)(RouterComponent);
