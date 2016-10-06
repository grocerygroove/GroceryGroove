import React, {Component} from 'react';
import TextField from 'material-ui/TextField';

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
        </div>
    );
  }
}

export default LoginComponent;