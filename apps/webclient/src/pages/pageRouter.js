import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginComponent from './login/login';
import GroceryListComponent from './groceryList';
import CategoriesComponent from './categories/categories';

const style = {
    contentDiv: {
        height: "calc(100vh - 64px)", //The app bar is 64px tall
        width: '100%', //want all content divs to fill width
    },
};


const RouterComponent = ({
                page,
                }) => {
    switch (page) {
        case "login":
            return <LoginComponent />;
        case "grocery-list":
            return <GroceryListComponent style={style.contentDiv}/>;
        case "categories":
            return <CategoriesComponent style={style.contentDiv}/>;
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
