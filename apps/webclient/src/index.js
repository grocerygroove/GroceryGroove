import React, {Component} from 'react';
import { white, greenA200, yellow600 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginComponent from './components/login';
const ReactDOM = require('react-dom');
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
    backgroundColor: '#29B6F6',
    height: '100%',
    width: '100%',
  },
  h1: {
      color: '#FAFAFA',
      textAlign: 'center',
  },
};

const muiTheme = getMuiTheme({
  raisedButton: {
    primaryColor: greenA200,
    secondaryColor: yellow600,
  },
  flatButton: {
    primaryTextColor: greenA200,
    secondaryTextColor: yellow600,
  },
  textField: {
    focusColor: greenA200,
  },
});


class App extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div style={styles.container}>
                <h1 style={styles.h1}>Grocery Groove</h1>
                <LoginComponent />
            </div>
        </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));
