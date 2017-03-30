import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';
import reduxReset from 'redux-reset';
import { white, greenA200, yellow600, lightBlue700 } from 'material-ui/styles/colors';
import groceryGrooveTheme from './theme/groceryGrooveTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import initalState from './initialState';
import AppComponent from './pages/app';
import ggApp from './reducers/gg_app';
import api from './api/apiClient';
import WebSocket from 'ws';

injectTapEventPlugin();

const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};


const enhancedCreateStore = compose(
    applyMiddleware(
        thunk.withExtraArgument({ api, socket: new WebSocket('ws://localhost:17000', { origin: "*"}) }),
        save(),
        createLogger()),
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

document.body.style.backgroundColor = lightBlue700;
ReactDOM.render(<App />, document.getElementById('container'));
