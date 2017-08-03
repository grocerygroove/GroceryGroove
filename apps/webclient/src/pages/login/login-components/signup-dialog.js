import { connect } from 'react-redux';
import { clearSignupErrorIfExists } from '../signup-actions';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { INVALID_EMAIL_ERROR } from '../../../components/generic-errors';
import { lightBlue700 } from 'material-ui/styles/colors';
import { PASSWORDS_DONT_MATCH_ERROR } from '../../../components/generic-errors';
import { PropTypes } from 'react';
import { signupByEmail } from '../signup-actions';
import { signupCredentialChange } from '../signup-actions';
import { signupValidationError } from '../signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD } from '../signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_EMAIL } from '../signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_PASSWORD } from '../signup-actions';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextBox from '../../../components/generic/textbox/TextBox';
import { toggleSignupDialog } from '../signup-actions';
import validateEmail from '../../../utils/validate-email';


const style = {
    body: {
        textAlign: 'center',
    },
    content: {
        maxWidth: '400px',
    },
};

const textBoxStyle = {
    text: {color: "#000000", borderColor: lightBlue700},
    label: {color: lightBlue700},
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
        <TextBox
            label="Email Address"
            value={signupEmail}
            errorText={emailErrorText || ""}
            style={textBoxStyle}
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_EMAIL)}/>
        <br />
        <TextBox
            label="Password"
            value={signupPassword}
            errorText={passwordsErrorText || ""}
            isPasswordField
            style={textBoxStyle}
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_PASSWORD)}/>
        <TextBox
            label="Confirm Password"
            value={signupConfirmPassword}
            errorText={passwordsErrorText || ""}
            isPasswordField
            style={textBoxStyle}
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
        signupDialogVisible: state.getIn([ 'signup', 'signupDialogVisible' ]),
        signupRequestPending: state.getIn([ 'signup', 'requestPending' ], false),
        signupEmail: state.getIn([ 'signup', 'signupCreds', 'email' ], ''),
        signupPassword: state.getIn([ 'signup', 'signupCreds', 'password' ], ''),
        signupConfirmPassword: state.getIn([ 'signup', 'signupCreds', 'confirmPassword' ], ''),
        emailErrorText: state.getIn([ 'signup', 'signupErrors', 'emailErrorText' ]),
        passwordsErrorText: state.getIn([ 'signup', 'signupErrors', 'passwordsErrorText' ]),
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
            if (!validateEmail(email)) {
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
