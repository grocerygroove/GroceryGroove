var injectTapEventPlugin = require('react-tap-event-plugin');
var React = require('react');
var ReactDOM = require('react-dom');
injectTapEventPlugin();

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('container')
);
