import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import { white, greenA200, yellow600 } from 'material-ui/styles/colors';

import { getCategories } from '../actions/categories_actions';

const style = {
    list: {
        backgroundColor: white,
    },
};

const CategoriesComponent = ({
                categories,
                token,
                selectedHousholdId,
                getCategories,
}) => {
    if (categories.length === 0) {
        getCategories(token, selectedHousholdId);
    }


    const style = {
        paper: {
            height: '100%',
            width: '100%',
            textAlign: 'center',
            display: 'inline-block',
        },
        listItem: {
            backgroundColor: white,
        },
    };
    return (
<div>
    <Paper
        style={style.paper}
        zDepth={1}>
        <List style={style.list}>
        {categories.map(x => {
                return (
                    <ListItem primaryText={x.name} style={style.listItem} />
                );

            })
        }
        </List>
    </Paper>
</div>
    );
};

CategoriesComponent.propTypes = {
    categories: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
    selectedHousholdId: PropTypes.number.isRequired,
    getCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return Object.assign({}, ownProps, {
        categories: state.get('categories').toJS(),
        token: state.getIn([ 'credentials', 'token' ]),
        selectedHousholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCategories: (token, selectedHousholdId) => {
            dispatch(getCategories(token, selectedHousholdId));
        },
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoriesComponent);
