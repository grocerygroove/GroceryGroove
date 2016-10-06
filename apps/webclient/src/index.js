import React, {Component} from 'react';
import { white } from 'material-ui/styles/colors';
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
  },
};

const muiTheme = getMuiTheme({
  palette: {
    textColor: white,
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
                <h1>Grocery Groove</h1>
                <LoginComponent />
            </div>
        </MuiThemeProvider>
    );
  }
}

ReactDOM.render(
    <App />,
    document.getElementById('container')
);
