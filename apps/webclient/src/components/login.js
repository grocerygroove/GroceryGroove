import React, {Component} from 'react';
import { greenA200, yellow600 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,

};

class LoginComponent extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
        <div>
            <TextField hintText="Username" floatingLabelText="Username"/>
            <br />
            <TextField hintText="Password" floatingLabelText="Password" type="password"/>
            <br />
            <RaisedButton label="Login" primary={true} style={style} />
            <RaisedButton label="Signup" secondary={true} style={style} />
        </div>
    );
  }
}

export default LoginComponent;
