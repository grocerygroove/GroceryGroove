import React, {Component} from 'react';
import { white, greenA200, yellow600, lightBlue700 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginComponent from './components/login';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import initalState from './initialState';
import ReactDOM from 'react-dom';
import ggApp from './reducers/gg_app';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
  container: {
    paddingTop: 15,
    height: '100%',
    width: '100%',
  },
  h1: {
      color: '#FAFAFA',
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

let store = createStore(ggApp, initalState);


const App = () => {
        return (
            <Provider store={store}>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <div className="row" style={styles.container}>
                        <div className="col-xs-12">
                            <div className="row center-xs">
                                <div className="col-sm-12 col-md-10 col-lg-4">
                                    <h1 style={styles.h1}>Grocery Groove</h1>
                                    <LoginComponent />
                                </div>
                            </div>
                        </div>
                    </div>
                </MuiThemeProvider>
            </Provider>
        );
};

ReactDOM.render(<App />, document.getElementById('container'));
