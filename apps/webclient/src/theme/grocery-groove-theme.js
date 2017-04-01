import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { greenA200 } from 'material-ui/styles/colors';
import { lightBlue700 } from 'material-ui/styles/colors';
import { white } from 'material-ui/styles/colors';
import { yellow600 } from 'material-ui/styles/colors';

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

export default muiTheme;