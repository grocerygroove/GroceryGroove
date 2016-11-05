import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { white, greenA200, yellow600 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import SignupDialog from './login_components/signupDialog';
//Redux
const { changePage } = require('../actions/page_actions');
const { toggleSnackbar } = require('../actions/login_actions');

const style = {
  button: {
    margin: 12,
  },
  textField: {
    color: white,
  },
  h1: {
    color: '#FAFAFA',
  },
};


const LoginComponent = ({
            snackbarOpen,
            snackbarMessage,
            toggleSnackbar,

            changePage,
            }) => {
    return (
<div className="col-xs-12">
    <div className="row center-xs">
        <div className="col-sm-12 col-md-10 col-lg-4">
            <h1 style={style.h1}>Grocery Groove</h1>
            <div>
                <TextField
                    hintText="Email Address"
                    floatingLabelText="Email Address"
                    inputStyle={style.textField}/>
                <br />
                <TextField
                    hintText="Password"
                    floatingLabelText="Password"
                    type="password"
                    inputStyle={style.textField}/>
                <br />
                <span>
                    <RaisedButton
                        label="Login"
                        primary={true}
                        style={style.button}
                        onTouchTap={changePage}/>
                    <SignupDialog
                        style={style.button}/>
                </span>
            </div>
            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                autoHideDuration={4000}
                onRequestClose={toggleSnackbar}
                />
        </div>
    </div>
</div>
    );
};

LoginComponent.propTypes = {
    snackbarOpen: PropTypes.bool.isRequired,
    snackbarMessage: PropTypes.string,
    toggleSnackbar: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        snackbarOpen: state.login.snackbar.open,
        snackbarMessage: state.login.snackbar.message,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleSnackbar: () => {
            dispatch(toggleSnackbar());
        },
        changePage: () => {
            dispatch(changePage("app"));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
