import api from './api/api-client';
import AppComponent from './components/app';
import { applyMiddleware } from 'redux';
import { compose } from 'redux';
import { createStore } from 'redux';
import ggApp from './reducers/gg-app';
import groceryGrooveTheme from './theme/grocery-groove-theme';
import { lightBlue700 } from 'material-ui/styles/colors';
import { load } from 'redux-localstorage-simple';
import initalState from './initial-state';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { save } from 'redux-localstorage-simple';
import React from 'react';
import ReactDOM from 'react-dom';
import reduxReset from 'redux-reset';
import thunk from 'redux-thunk';
import WebSocket from 'ws';

injectTapEventPlugin();

const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};


const enhancedCreateStore = compose(
  applyMiddleware(
    thunk.withExtraArgument({ api, socket: new WebSocket('ws://localhost:17000', { origin: "*"}) }),
    save()),
  reduxReset()  // Will use 'RESET' as default action.type to trigger reset
)(createStore);

const store = enhancedCreateStore(
  ggApp,
  (isObjectEmpty(load({ immutablejs: true })) ? initalState : load({ immutablejs: true })) //Try to load from local storage...if that doesn't exist use initialState
);



const App = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider muiTheme={groceryGrooveTheme}>
        <AppComponent /> 
      </MuiThemeProvider>
    </Provider>
  );
};

document.body.style.backgroundColor = '#4ABDAC';
ReactDOM.render(<App />, document.getElementById('container'));
