import React from 'react';
import { greenA200, yellow600 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PageRouter from './pages/pageRouter';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
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

const logger = createLogger();
const store = createStore(ggApp, initalState, applyMiddleware(logger));



const App = () => {
        return (
            <Provider store={store}>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <div className="row" style={styles.container}>
                        <PageRouter />
                    </div>
                </MuiThemeProvider>
            </Provider>
        );
};

ReactDOM.render(<App />, document.getElementById('container'));
