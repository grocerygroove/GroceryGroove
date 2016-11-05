import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { greenA200 } from 'material-ui/styles/colors';
const emailMatchRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
//Redux
const {
    toggleSignupDialog,

    SIGNUP_CREDENTIAL_TYPE_EMAIL,
    SIGNUP_CREDENTIAL_TYPE_PASSWORD,
    SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD,
    signupCredentialChange,

    signupByEmail,

    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
    signupValidationError,
    clearSignupErrorIfExists,

} = require('../../actions/signup_actions');

const style = {
    body: {
        textAlign: 'center',
    },
    content: {
        maxWidth: '400px',
    },
};

const SignupDialog = ({
            signupDialogVisible,
            signupRequestPending,
            signupEmail,
            signupPassword,
            signupConfirmPassword,
            emailErrorText,
            passwordsErrorText,
            onSignupClick,
            toggleSignup,
            onSignupCredentialChange,
            }) => {

    const actions = signupRequestPending ?
     [
         <CircularProgress />,
     ] :
     [
        <FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={onSignupClick.bind(null, signupEmail, signupPassword, signupConfirmPassword)}
        />,
        <FlatButton
            label="Cancel"
            secondary={true}
            keyboardFocused={true}
            onTouchTap={toggleSignup}
        />,
    ];
    return (
    <div>
        <RaisedButton label="Signup" secondary={true} onTouchTap={toggleSignup} />
        <Dialog
        title="Create an Account"
        actions={actions}
        modal={false}
        open={signupDialogVisible}
        onRequestClose={toggleSignup}
        bodyStyle = {style.body}
        contentStyle = {style.content}
        autoScrollBodyContent={true}
        >
        <TextField
            hintText="Email Address"
            floatingLabelText="Email Address"
            value={signupEmail}
            errorText={emailErrorText || ""}
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_EMAIL)}/>
        <br />
        <TextField
            hintText="Password"
            floatingLabelText="Password"
            value={signupPassword}
            type="password"
            errorText={passwordsErrorText || ""}
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_PASSWORD)}/>
        <br />
        <TextField
            id= "ConfirmPassword"
            hintText="Confirm Password"
            floatingLabelText="Confirm Password"
            value={signupConfirmPassword}
            type="password"
            errorText={passwordsErrorText || ""}
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD)}/>
        </Dialog>
    </div>
    );
};

SignupDialog.propTypes = {
    signupDialogVisible: PropTypes.bool.isRequired,
    signupRequestPending: PropTypes.bool.isRequired,
    signupEmail: PropTypes.string.isRequired,
    signupPassword: PropTypes.string.isRequired,
    signupConfirmPassword: PropTypes.string.isRequired,
    emailErrorText: PropTypes.string,
    passwordsErrorText: PropTypes.string,
    onSignupClick: PropTypes.func.isRequired,
    toggleSignup: PropTypes.func.isRequired,
    onSignupCredentialChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        signupDialogVisible: state.signup.signupDialogVisible,
        signupRequestPending: state.signup.requestPending || false,
        signupEmail: (state.signup.signupCreds ? state.signup.signupCreds.email || '' : ''),
        signupPassword: (state.signup.signupCreds ? state.signup.signupCreds.password || '' : ''),
        signupConfirmPassword: (state.signup.signupCreds ? state.signup.signupCreds.confirmPassword || '' : ''),
        emailErrorText: (state.signup.signupErrors && state.signup.signupErrors.emailErrorText),
        passwordsErrorText: (state.signup.signupErrors && state.signup.signupErrors.passwordsErrorText),
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSignupCredentialChange: (credentialType, event) => {
            dispatch(signupCredentialChange(credentialType, event.target.value));
        },
        onSignupClick: (email, password, confirmPassword) => {
            let errors = false;
            //Do syncrounous validation
            if (!email.match(emailMatchRegex)) {
                dispatch(signupValidationError(INVALID_EMAIL_ERROR));
                errors = true;
            } else {
                dispatch(clearSignupErrorIfExists(INVALID_EMAIL_ERROR));
            }
            if (password !== confirmPassword) {
                dispatch(signupValidationError(PASSWORDS_DONT_MATCH_ERROR));
                errors = true;
            } else {
                dispatch(clearSignupErrorIfExists(PASSWORDS_DONT_MATCH_ERROR));
            }

            if (!errors) {
            //Validation good
            dispatch(signupByEmail(email, password));
            }
        },
        toggleSignup: () => {
            dispatch(toggleSignupDialog());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupDialog);
