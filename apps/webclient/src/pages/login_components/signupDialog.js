import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { greenA200 } from 'material-ui/styles/colors';
//Redux
const { toggleSignupDialog, setEmail, setPassword, setConfirmPassword, cancelSignup, signupByEmail } = require('../../actions/signup_actions');
const apiClient = require('../../api/apiClient');

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
            email,
            password,
            confirmPassword,
            onSignupClick,
            setEmail,
            setPassword,
            setConfirmPassword,
            toggleSignup,
            cancelSignup,
            }) => {

    const actions = [
        <FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={onSignupClick.bind(null, email, password, confirmPassword)}
        />,
        <FlatButton
            label="Cancel"
            secondary={true}
            keyboardFocused={true}
            onTouchTap={cancelSignup}
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
            onChange={setEmail}/>
        <br />
        <TextField
            hintText="Password"
            floatingLabelText="Password"
            type="password"
            onChange={setPassword}/>
        <br />
        <TextField
            id= "ConfirmPassword"
            hintText="Confirm Password"
            floatingLabelText="Confirm Password"
            type="password"
            onChange={setConfirmPassword}/>
        </Dialog>
    </div>
    );
};

SignupDialog.propTypes = {
    signupDialogVisible: PropTypes.bool.isRequired,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    onSignupClick: PropTypes.func.isRequired,
    setEmail: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    setConfirmPassword: PropTypes.func.isRequired,
    cancelSignup: PropTypes.func.isRequired,
    toggleSignup: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        signupDialogVisible: state.signup.signupDialogVisible,
        email: state.signup.email,
        password: state.signup.password,
        confirmPassword: state.signup.confirmPassword,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSignupClick: (email, password, confirmPassword) => {
            //TODO: Do validation

            //TODO: Validation error action

            //Validation good
            dispatch(signupByEmail(email, password));
        },
        toggleSignup: () => {
            dispatch(toggleSignupDialog());
        },
        cancelSignup: () => {
            dispatch(cancelSignup());
        },
	    setEmail: (event) => {
            dispatch(setEmail(event.target.value));
        },
	    setPassword: (event) => {
            dispatch(setPassword(event.target.value));
        },
	    setConfirmPassword: (event) => {
            dispatch(setConfirmPassword(event.target.value));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupDialog);
