import React, { Component } from 'react';
import { white, greenA200, yellow600 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SignupDialog from './signupDialog';

const style = {
  button: {
    margin: 12,
  },
  textField: {
    color: white,
  },
};

const LoginComponent = React.createClass({
  render: function() {
    return (
        <div>
            <TextField
                hintText="Username"
                floatingLabelText="Username"
                inputStyle={style.textField}/>
            <br />
            <TextField
                hintText="Password"
                floatingLabelText="Password"
                type="password"
                inputStyle={style.textField}/>
            <br />
            <span>
                <RaisedButton
                    label="Login"
                    primary={true}
                    style={style.button} />
                <SignupDialog
                    style={style.button}/>
            </span>
        </div>
    );
  },
});

export default LoginComponent;
