import { connect } from 'react-redux';
import { clearSignupErrorIfExists } from '../signup-actions';
import { INVALID_EMAIL_ERROR } from '../../../components/generic-errors';
import Modal from '../../../components/generic/modal/Modal';
import { PASSWORDS_DONT_MATCH_ERROR } from '../../../components/generic-errors';
import { PropTypes } from 'react';
import { signupByEmail } from '../signup-actions';
import { signupCredentialChange } from '../signup-actions';
import { signupValidationError } from '../signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD } from '../signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_EMAIL } from '../signup-actions';
import { SIGNUP_CREDENTIAL_TYPE_PASSWORD } from '../signup-actions';
import React from 'react';
import TextBox from '../../../components/generic/textbox/TextBox';
import { toggleSignupDialog } from '../signup-actions';
import validateEmail from '../../../utils/validate-email';

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

    return (
<Modal
    showModal={signupDialogVisible}
    headerText="Create an Account"
    confirmButtonText="Submit"
    onCancelClick={toggleSignup}
    onConfirmClick={onSignupClick.bind(null, signupEmail, signupPassword, signupConfirmPassword)} >
        <TextBox
            label="Email Address"
            value={signupEmail}
            errorText={emailErrorText || ""}
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_EMAIL)}/>
        <TextBox
            label="Password"
            value={signupPassword}
            errorText={passwordsErrorText || ""}
            isPasswordField
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_PASSWORD)}/>
        <TextBox
            label="Confirm Password"
            value={signupConfirmPassword}
            errorText={passwordsErrorText || ""}
            isPasswordField
            onChange={onSignupCredentialChange.bind(null, SIGNUP_CREDENTIAL_TYPE_CONFIRM_PASSWORD)}/>
</Modal>
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
