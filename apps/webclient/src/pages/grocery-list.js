import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import { white, greenA200, yellow600 } from 'material-ui/styles/colors';

const GroceryListComponent = ({style}) => {
    const computedStyle = {
        paper: Object.assign({}, style, {   
            //Fill in specific style here         
        }),
    };
    return (
<div>
    <Paper
        style={computedStyle.paper}
        zDepth={1}>
    </Paper>
</div>
    );
};

GroceryListComponent.propTypes = {
    style: PropTypes.object,
}

export default GroceryListComponent;
