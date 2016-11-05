import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { white, greenA200, yellow600 } from 'material-ui/styles/colors';

const AppComponent = () => {

    const toggler = () => {};
    const style = {
        paper: {
            height: '100%',
            width: '100%',
            textAlign: 'center',
            display: 'inline-block',
        },
        appbar: {
            width: '100%',
            margin: 0,
        },
    };
    return (
<div>
    <AppBar
        title="Grocery List"
        style={style.appbar}
        onLeftIconButtonTouchTap={toggler}/>
    <Paper
        style={style.paper}
        zDepth={1}>
    </Paper>
    <Drawer open={false}>
        <MenuItem>Menu Item</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
    </Drawer>


</div>
    );
};

export default AppComponent;
