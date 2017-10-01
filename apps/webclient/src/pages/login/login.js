import Button from '../../components/generic/button/Button';
import { changePage } from '../../components/page-actions';
import { clearLoginErrorIfExists } from './login-actions';
import { connect } from 'react-redux';
import FaceIcon from 'react-icons/lib/md/face';
import { INVALID_EMAIL_ERROR } from '../../components/generic-errors';
import { LOGIN_CREDENTIAL_TYPE_EMAIL } from './login-actions';
import { LOGIN_CREDENTIAL_TYPE_PASSWORD } from './login-actions';
import { loginByEmail } from './login-actions';
import { loginCredentialChange } from './login-actions';
import { loginValidationError } from './login-actions';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';
import SignupDialog from './login-components/signup-dialog';
import TagFace from 'react-icons/lib/md/tag-faces';
import TextBox from '../../components/generic/textbox/TextBox';
import { toggleSignupDialog } from './signup-actions';
import validateEmail from '../../utils/validate-email';
import VpnKeyIcon from 'react-icons/lib/md/vpn-key';


const style = {
  pageview: {
    height: '100%',
    padding: '0px',
    backgroundColor: 'transparent',
    boxShadow: 'transparent',
  },
};


const LoginComponent = ({
  loginEmail,
  loginPassword,
  emailErrorText,
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
              classNames={['loginButton']}
              text="Login"
              primary={true}
              onClick={onLoginClick.bind(null, loginEmail, loginPassword)}/>
            <Button
              classNames={['loginButton']}
              text="Signup"
              secondary
              onClick={toggleSignup} />
          </span>
        </div>
        <SignupDialog />
      </div>
    </PageComponent>
  );
};

LoginComponent.propTypes = {
  loginEmail: PropTypes.string.isRequired,
  loginPassword: PropTypes.string.isRequired,
  emailErrorText: PropTypes.string,
  onLoginClick: PropTypes.func.isRequired,
  onLoginCredentialChange: PropTypes.func.isRequired,
  toggleSignup: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    loginEmail: state.getIn([ 'login', 'loginCreds', 'email' ], ''),
    loginPassword: state.getIn([ 'login', 'loginCreds', 'password' ], ''),
    emailErrorText: state.getIn([ 'login', 'loginErrors', 'emailErrorText' ], ''),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
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
