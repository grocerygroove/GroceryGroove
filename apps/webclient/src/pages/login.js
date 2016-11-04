import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { white, greenA200, yellow600 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SignupDialog from './login_components/signupDialog';
//Redux
const { changePage } = require('../actions/page_actions');

const style = {
  button: {
    margin: 12,
  },
  textField: {
    color: white,
  },
  h1: {
    color: '#FAFAFA',
  },
};


const LoginComponent = ({
            changePage,
            }) => {
    return (
<div className="col-xs-12">
    <div className="row center-xs">
        <div className="col-sm-12 col-md-10 col-lg-4">
            <h1 style={style.h1}>Grocery Groove</h1>
            <div>
                <TextField
                    hintText="Email Address"
                    floatingLabelText="Email Address"
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
                        style={style.button}
                        onTouchTap={changePage}/>
                    <SignupDialog
                        style={style.button}/>
                </span>
            </div>
        </div>
    </div>
</div>
    );
};

LoginComponent.propTypes = {
    changePage: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
    return {
        changePage: () => {
            dispatch(changePage("non-existant page"));
        },
    };
};

export default connect(void(0), mapDispatchToProps)(LoginComponent);
