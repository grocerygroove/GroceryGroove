import React, {Component} from 'react';
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

class LoginComponent extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
        <div>
            <TextField
                hintText="Username"
                floatingLabelText="Username"
                style={style.textField}/>
            <br />
            <TextField
                hintText="Password"
                floatingLabelText="Password"
                type="password"
                style={style.textField}/>
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
  }
}

export default LoginComponent;
