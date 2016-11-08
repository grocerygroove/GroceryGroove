import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { white, greenA200, yellow600 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import SignupDialog from './login_components/signupDialog';
import validateEmail from '../utils/validateEmail';
//Redux
import { changePage } from '../actions/navigation_actions';
import {
   toggleSnackbar,

    LOGIN_CREDENTIAL_TYPE_EMAIL,
    LOGIN_CREDENTIAL_TYPE_PASSWORD,
    loginCredentialChange,

    loginByEmail,

    loginValidationError,
    clearLoginErrorIfExists,
 } from '../actions/login_actions';
import {
    INVALID_EMAIL_ERROR,
} from '../actions/generic_errors';

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
            loginEmail,
            loginPassword,
            emailErrorText,
            toggleSnackbar,
            onLoginClick,
            onLoginCredentialChange,
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
                    inputStyle={style.textField}
                    value={loginEmail}
                    errorText={emailErrorText || ""}
                    onChange={onLoginCredentialChange.bind(null, LOGIN_CREDENTIAL_TYPE_EMAIL)}/>
                <br />
                <TextField
                    hintText="Password"
                    floatingLabelText="Password"
                    type="password"
                    inputStyle={style.textField}
                    value={loginPassword}
                    onChange={onLoginCredentialChange.bind(null, LOGIN_CREDENTIAL_TYPE_PASSWORD)}/>
                <br />
                <span>
                    <RaisedButton
                        label="Login"
                        primary={true}
                        style={style.button}
                        onTouchTap={onLoginClick.bind(null, loginEmail, loginPassword)}/>
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
    loginEmail: PropTypes.string.isRequired,
    loginPassword: PropTypes.string.isRequired,
    emailErrorText: PropTypes.string,
    toggleSnackbar: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onLoginCredentialChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        snackbarOpen: state.getIn([ 'login', 'snackbar', 'open' ]),
        snackbarMessage: state.getIn([ 'login', 'snackbar', 'message' ]),
        loginEmail: state.getIn([ 'login', 'loginCreds', 'email' ], ''),
        loginPassword: state.getIn([ 'login', 'loginCreds', 'password' ], ''),
        emailErrorText: state.getIn([ 'login', 'loginErrors', 'emailErrorText' ], ''),
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleSnackbar: () => {
            dispatch(toggleSnackbar());
        },
        onLoginClick: (email, password) => {
            let errors = false;
            //Do some validation
            if (!validateEmail(email)) {
                dispatch(loginValidationError(INVALID_EMAIL_ERROR));
                errors = true;
            } else {
                dispatch(clearLoginErrorIfExists(INVALID_EMAIL_ERROR));
            }


            if (!errors) {
                //Do login
                dispatch(loginByEmail(email, password));
            }
        },
        onLoginCredentialChange: (credentialType, event) => {
            dispatch(loginCredentialChange(credentialType, event.target.value));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginComponent);
