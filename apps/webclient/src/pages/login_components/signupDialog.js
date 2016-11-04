import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { greenA200 } from 'material-ui/styles/colors';
//Redux
const { toggleSignupDialog, setUsername, setPassword, setConfirmPassword, cancelSignup, spitStore } = require('../../actions/signup_actions');

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
            onSignupClick,
            setUsername,
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
            onTouchTap={onSignupClick}
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
            id= "Username"
            hintText="Username"
            floatingLabelText="Username"
            onChange={setUsername}/>
        <br />
        <TextField
            id= "Password"
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
    onSignupClick: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    setConfirmPassword: PropTypes.func.isRequired,
    cancelSignup: PropTypes.func.isRequired,
    toggleSignup: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        signupDialogVisible: state.signup.signupDialogVisible,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSignupClick: () => {
            dispatch(spitStore());
        },
        toggleSignup: () => {
            dispatch(toggleSignupDialog());
        },
        cancelSignup: () => {
            dispatch(cancelSignup());
        },
	    setUsername: (event) => {
            dispatch(setUsername(event.target.value));
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
