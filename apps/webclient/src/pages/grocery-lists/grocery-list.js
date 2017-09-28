import { connect } from 'react-redux';
import { getGroceryLists } from './grocery-lists-actions';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';


const GroceryListComponent = ({
  groceryLists,
  token,
  selectedHouseholdId,
  getGroceryLists,
}) => {    
  //TODO: don't always collect lists
  getGroceryLists(token, selectedHouseholdId);

  return (
    <PageComponent pageTitle="Grocery List">
      <div className='groceryListPage'>
        <span className={`noGroceryLists ${ !groceryLists || groceryLists.length == 0 ? 'show' : '' }`}>
          You don't have any groceryLists.
        </span>
        <div>
          {JSON.stringify(groceryLists,null,2)}
        </div>
      </div>
    </PageComponent>
  );
};

GroceryListComponent.propTypes = {
  groceryLists: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,
  getGroceryLists: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    groceryLists: state.getIn([ 'groceryLists', 'lists' ]).toJS(),
    token: state.getIn([ 'credentials', 'token' ]),
    selectedHouseholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroceryLists: (token, householdId) => {
      dispatch(getGroceryLists(token, householdId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroceryListComponent);
