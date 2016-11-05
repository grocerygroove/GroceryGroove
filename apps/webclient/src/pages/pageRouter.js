import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginComponent from './login';
import AppComponent from './app';
import NotFoundComponent from './notFound';

const RouterComponent = ({
                page,
                }) => {
    switch (page) {
        case "login":
            return <LoginComponent />;
        case "app":
            return <AppComponent />;
        default:
            return <NotFoundComponent />;
    }
};

RouterComponent.propTypes = {
    page: PropTypes.string,
};


const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        page: state.page,
    });
};

export default connect(mapStateToProps)(RouterComponent);
