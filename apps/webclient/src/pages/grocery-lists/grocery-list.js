import Button from '../../components/generic/button/Button';
import { connect } from 'react-redux';
import { getGroceryLists } from './grocery-lists-actions';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';

const FIVE_MINS = 1000 * 60 * 5;

const GroceryListComponent = ({
  lastCheckedGroceryList,
  groceryLists,
  token,
  selectedHouseholdId,
  getGroceryLists,
}) => {    
  if (!lastCheckedGroceryList || ((new Date) - lastCheckedGroceryList) > FIVE_MINS) {
    getGroceryLists(token, selectedHouseholdId);
  }

  return (
    <PageComponent pageTitle="Grocery List">
      <div className='groceryListPage'>
        {  lastCheckedGroceryList && groceryLists.length == 0 &&
            <div id='noGroceryLists'>
              <p>You don't have any grocery lists. Would you like to add one?</p>
              <Button
                text="Create a Grocery List"
                primary={true}
              />
            </div>
        }
        {  lastCheckedGroceryList && groceryLists.length > 0 &&
            <div>
              {JSON.stringify(groceryLists,null,2)}
            </div>
        }
      </div>
    </PageComponent>
  );
};

GroceryListComponent.propTypes = {
  lastCheckedGroceryList: PropTypes.object,
  groceryLists: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,
  getGroceryLists: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    lastCheckedGroceryList: state.getIn([ 'groceryLists', 'lastChecked' ]),
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
