import { connect } from 'react-redux';
import { getCategories } from './categories-actions';
import { List } from 'material-ui/List';
import { ListItem } from 'material-ui/List';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';
import { white } from 'material-ui/styles/colors';

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
        listItem: {
            backgroundColor: white,
        },
    };
    return (
<PageComponent pageTitle="Categories">
    <List>
    {categories.map(x => {
            return (
                <ListItem primaryText={x.name} style={style.listItem} />
            );

        })
    }
    </List>
</PageComponent>
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
