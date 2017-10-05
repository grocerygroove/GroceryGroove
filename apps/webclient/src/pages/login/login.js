import Button from '../../components/generic/button/Button';
import { changePage } from '../../components/page-actions';
import { clearLoginErrorIfExists } from './login-actions';
import { connect } from 'react-redux';
import FaceIcon from 'react-icons/lib/md/face';
import { INVALID_EMAIL_ERROR } from '../../components/generic-errors';
import { loginByEmail } from './login-actions';
import { loginCredentialChange } from './login-actions';
import { loginValidationError } from './login-actions';
import PageComponent from '../../components/page-component';
import PropTypes from 'prop-types';
import React from 'react';
import SignupDialog from './components/signup/signup-dialog';
import { signupByEmail } from './components/signup/signup-actions';
import TagFace from 'react-icons/lib/md/tag-faces';
import TextBox from '../../components/generic/textbox/TextBox';
import { toggleSignupDialog } from './components/signup/signup-actions';
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

class LoginComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  
  changeEmail(event) {
    event.persist();
    this.setState((prevState) => {
      return Object.assign(prevState, {
        email: event.target.value,
      });
    });
  }

  changePassword(event) {
    event.persist();
    this.setState((prevState) => {
      return Object.assign(prevState, {
        password: event.target.value,
      });
    });
  }

  render() {
    const {
      emailErrorText,
      signupDialogVisible,
      signupErrors,
      onLoginClick,
      onLoginCredentialChange,
      toggleSignup,
      onSignupClick,
    } = this.props;

    const {
      email,
      password,
    } = this.state;

    const emailGood = (email) => {
      return (email && email !== "" && validateEmail(email));
    };

    return (
      <PageComponent styleOverride={style}>
        <div className='loginPage'>
          <div className='login'>
            <h1 className='header'>Grocery Groove</h1>
            <span className='loginCredSpan'>
              <div className='iconDiv'>
                <FaceIcon className={emailGood(email) ? 'back' : 'front'} />
                <TagFace className={!emailGood(email) ? 'back' : 'front'} />
              </div>
              <TextBox
                label="Email Address"
                errorText={emailErrorText || ""}
                value={email}
                onChange={this.changeEmail.bind(this)}/>
            </span>
            <span className='loginCredSpan'>
              <div className='iconDiv'>
                <VpnKeyIcon />
              </div>
              <TextBox
                label="Password"
                value={password}
                onChange={this.changePassword.bind(this)}
                isPasswordField/>
            </span>
            <span className='buttonSpan'>
              <Button
                classNames={['loginButton']}
                text="Login"
                primary={true}
                onClick={onLoginClick.bind(null, email, password)}/>
              <Button
                classNames={['loginButton']}
                text="Signup"
                secondary
                onClick={toggleSignup} />
            </span>
          </div>
          <SignupDialog 
            dialogVisible={signupDialogVisible}
            signupErrors={signupErrors}
            onSignupClick={onSignupClick}
            toggleDialog={toggleSignup}/>
        </div>
      </PageComponent>
    );
  }
}

LoginComponent.propTypes = {
  emailErrorText: PropTypes.string,
  signupDialogVisible: PropTypes.bool.isRequired,
  signupErrors: PropTypes.object,
  onLoginClick: PropTypes.func.isRequired,
  onLoginCredentialChange: PropTypes.func.isRequired,
  onSignupClick: PropTypes.func,
  toggleSignup: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    emailErrorText: state.getIn([ 'login', 'state', 'loginErrors', 'emailErrorText' ], ''),
    signupDialogVisible: state.getIn([ 'login', 'signup', 'visible' ]),
    signupErrors: state.getIn([ 'login', 'signup', 'errors' ]).toJS(),
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
    onSignupClick: (email, nickname, password) => {
      dispatch(signupByEmail(email, nickname, password));
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
