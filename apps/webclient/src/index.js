import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { save, load } from 'redux-localstorage-simple';
import reduxReset from 'redux-reset';
import { white, greenA200, yellow600, lightBlue700 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import initalState from './initialState';
import AppComponent from './pages/app';
import ggApp from './reducers/gg_app';

injectTapEventPlugin();

const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
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
const enhancedCreateStore = compose(
    applyMiddleware(promiseMiddleware(), save(), createLogger()),
    reduxReset()  // Will use 'RESET' as default action.type to trigger reset
)(createStore);

const store = enhancedCreateStore(
    ggApp,
    (isObjectEmpty(load({ immutablejs: true })) ? initalState : load({ immutablejs: true })) //Try to load from local storage...if that doesn't exist use initialState
);



const App = () => {
    return (
<Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
        <AppComponent style={styles.container}/>
    </MuiThemeProvider>
</Provider>
    );
};

document.body.style.backgroundColor = lightBlue700;
ReactDOM.render(<App />, document.getElementById('container'));
