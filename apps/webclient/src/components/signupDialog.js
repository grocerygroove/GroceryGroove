import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { greenA200 } from 'material-ui/styles/colors';
//Redux
const { setCredentials, toggleSignupDialog } = require('../actions/login_actions');

const style = {
    body: {
        textAlign: 'center',
    },
    content: {
        maxWidth: '400px',
    },
};

class SignupDialog extends Component {
    render() {
        const { signupDialogVisible, onSignupClick, toggleSignup } = this.props;
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
            <TextField hintText="Username" floatingLabelText="Username"/>
            <br />
            <TextField hintText="Password" floatingLabelText="Password" type="password"/>
            <br />
            <TextField hintText="Confirm Password" floatingLabelText="Confirm Password" type="password"/>
            </Dialog>
        </div>
        );
    }
}

SignupDialog.propTypes = {
    signupDialogVisible: PropTypes.bool.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    toggleSignup: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        signupDialogVisible: state.login.signupDialogVisible,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSignupClick: () => {
            dispatch(toggleSignupDialog());
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
