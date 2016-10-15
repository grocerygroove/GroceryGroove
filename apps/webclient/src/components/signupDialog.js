import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { greenA200 } from 'material-ui/styles/colors';

const style = {
    body: {
        textAlign: 'center',
    },
    content: {
        maxWidth: '400px',
    },
};

export default class signupDialog extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Cancel"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <RaisedButton label="Signup" secondary={true} onTouchTap={this.handleOpen} />
        <Dialog
          title="Create an Account"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
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
