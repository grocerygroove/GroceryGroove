import React from 'react';
import { white, greenA200, yellow600, lightBlue700 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PageRouter from './pages/pageRouter';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import initalState from './initialState';
import ReactDOM from 'react-dom';
import ggApp from './reducers/gg_app';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    margin: 0,
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
  appBar: {
    color: lightBlue700,
    textColor: white,
  },
});

const store = createStore(
    ggApp,
    initalState,
    applyMiddleware(promiseMiddleware(), createLogger())
);



const App = () => {
    return (
<Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
        <PageRouter style={styles.container}/>
    </MuiThemeProvider>
</Provider>
    );
};

document.body.style.backgroundColor = lightBlue700;
ReactDOM.render(<App />, document.getElementById('container'));
