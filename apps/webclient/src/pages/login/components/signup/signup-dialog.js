import Modal from '../../../../components/generic/modal/Modal';
import { PropTypes } from 'react';
import React from 'react';
import TextBox from '../../../../components/generic/textbox/TextBox';
import validateEmail from '../../../../utils/validate-email';

class SignupDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      nickname: "",
      password: "",
      confirmPassword: "",
      invalidEmailError: "",
      passwordsDontMatchError: "",
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

  changeNickname(event) {
    event.persist();
    this.setState((prevState) => {
      return Object.assign(prevState, {
        nickname: event.target.value,
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

  changeConfirmPassword(event) {
    event.persist();
    this.setState((prevState) => {
      return Object.assign(prevState, {
        confirmPassword: event.target.value,
      });
    });
  }

  signupClickHandler() {
    const {
      email,
      nickname,
      password,
      confirmPassword,
    } = this.state;

    let errors = false;
    //Do syncrounous validation
    if (!validateEmail(email)) {
      this.setState((prevState) => {
        return Object.assign(prevState, {
          invalidEmailError: true,
        });
      });
      errors = true;
    } else {
      this.setState((prevState) => {
        return Object.assign(prevState, {
          invalidEmailError: false,
        });
      });
    }
    if (password !== confirmPassword) {
      this.setState((prevState) => {
        return Object.assign(prevState, {
          passwordsDontMatchError: true,
        });
      });
      errors = true;
    } else {
      this.setState((prevState) => {
        return Object.assign(prevState, {
          passwordsDontMatchError: false,
        });
      });
    }
    //Gaurd clause
    if (errors)
      return;

    //Validation good
    this.props.onSignupClick(
      this.state.email, 
      this.state.nickname, 
      this.state.password
    );
  }

  render(){
    const {
      dialogVisible,
      signupErrors,
      toggleDialog,
    } = this.props;

    const {
      email,
      nickname,
      password,
      confirmPassword,
      invalidEmailError,
      passwordsDontMatchError,
    } = this.state;

    return (
      <Modal
        showModal={dialogVisible}
        headerText="Create an Account"
        confirmButtonText="Submit"
        onCancelClick={toggleDialog}
        onConfirmClick={this.signupClickHandler.bind(this)}>
        <TextBox
          label="Email Address"
          value={email}
          errorText={(()=>{
            if (invalidEmailError)
              return "Invalid Email Format";
            else if(signupErrors && signupErrors.email)
              return signupErrors.email;
            else
              return "";
          })()}
          onChange={this.changeEmail.bind(this)}/>
        <TextBox
          label="Nickname"
          value={nickname}
          onChange={this.changeNickname.bind(this)}/>
        <TextBox
          label="Password"
          value={password}
          errorText={(()=>{
            if (passwordsDontMatchError)
              return "Passwords Don't Match";
            else if(signupErrors && signupErrors.password)
              return signupErrors.password;
            else
              return "";
          })()}
          isPasswordField
          onChange={this.changePassword.bind(this)}/>
        <TextBox
          label="Confirm Password"
          value={confirmPassword}
          errorText={(()=>{
            if (passwordsDontMatchError)
              return "Passwords Don't Match";
            else if(signupErrors && signupErrors.password)
              return signupErrors.password;
            else
              return "";
          })()}
          isPasswordField
          onChange={this.changeConfirmPassword.bind(this)}/>
      </Modal>
    );
  }
} 

SignupDialog.propTypes = {
  dialogVisible: PropTypes.bool.isRequired,
  signupErrors: PropTypes.object,
  onSignupClick: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

export default SignupDialog;
