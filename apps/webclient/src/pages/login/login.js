import { changePage } from '../../components/navigation-actions';
import { clearLoginErrorIfExists } from './login-actions';
import { connect } from 'react-redux';
import FaceIcon from 'material-ui/svg-icons/action/face';
import { INVALID_EMAIL_ERROR } from '../../components/generic-errors';
import { loginByEmail } from './login-actions';
import { loginCredentialChange } from './login-actions';
import { LOGIN_CREDENTIAL_TYPE_EMAIL } from './login-actions';
import { LOGIN_CREDENTIAL_TYPE_PASSWORD } from './login-actions';
import { loginValidationError } from './login-actions';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import Button from '../../components/generic/button/Button';
import React from 'react';
import SignupDialog from './login-components/signup-dialog';
import Snackbar from 'material-ui/Snackbar';
import TagFace from 'material-ui/svg-icons/image/tag-faces';
import TextBox from '../../components/generic/textbox/TextBox';
import { toggleSnackbar } from './login-actions';
import { toggleSignupDialog } from './signup-actions';
import validateEmail from '../../utils/validate-email';
import VpnKeyIcon from 'material-ui/svg-icons/communication/vpn-key';


const style = {
  paper: {
      height: '100%',
      backgroundColor: 'transparent',
      boxShadow: 'transparent',
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
            toggleSignup,
        }) => {
            const emailGood = (email) => {
                return (loginEmail && loginEmail !== "" && validateEmail(loginEmail));
            };
    return (
<PageComponent styleOverride={style}>
    <div className='loginPage'>
        <div className='login'>
            <h1 className='header'>Grocery Groove</h1>
              <span className='loginCredSpan'>
                  <div className='iconDiv'>
                      <FaceIcon className={emailGood(loginEmail) ? 'back' : 'front'} />
                      <TagFace className={!emailGood(loginEmail) ? 'back' : 'front'} />
                  </div>
                  <TextBox
                      label="Email Address"
                      errorText={emailErrorText || ""}
                      value={loginEmail}
                      onChange={onLoginCredentialChange.bind(null, LOGIN_CREDENTIAL_TYPE_EMAIL)}/>
              </span>
              <span className='loginCredSpan'>
                  <div className='iconDiv'>
                      <VpnKeyIcon />
                  </div>
                  <TextBox
                      label="Password"
                      value={loginPassword}
                      onChange={onLoginCredentialChange.bind(null, LOGIN_CREDENTIAL_TYPE_PASSWORD)}
                      isPasswordField/>
              </span>
              <span className='buttonSpan'>
                  <Button
                      className='loginButton'
                      text="Login"
                      primary={true}
                      onClick={onLoginClick.bind(null, loginEmail, loginPassword)}/>
                  <Button
                      className='loginButton'
                      text="Signup"
                      secondary
                      onClick={toggleSignup} />
              </span>

          <Snackbar
              open={snackbarOpen}
              message={snackbarMessage}
              autoHideDuration={4000}
              onRequestClose={toggleSnackbar}
              />
        </div>
    <SignupDialog />
    </div>
</PageComponent>
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
    toggleSignup: PropTypes.func.isRequired,
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
        toggleSignup: () => {
            dispatch(toggleSignupDialog());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginComponent);
