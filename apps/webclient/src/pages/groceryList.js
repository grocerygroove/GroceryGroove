import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import { white, greenA200, yellow600 } from 'material-ui/styles/colors';

const GroceryListComponent = () => {
    const style = {
        paper: {
            height: '100%',
            width: '100%',
            textAlign: 'center',
            display: 'inline-block',
        },
    };
    return (
<div>
    <Paper
        style={style.paper}
        zDepth={1}>
    </Paper>
</div>
    );
};

export default GroceryListComponent;
