import AddGroceryListDialog from './components/add-grocery-list-dialog';
import Button from '../../components/generic/button/Button';
import { connect } from 'react-redux';
import { getGroceryLists } from './grocery-lists-actions';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';
import { toggleAddGroceryListDialog } from './components/add-grocery-list-actions';

const FIVE_MINS = 1000 * 60 * 5;

const GroceryListComponent = ({
  lastCheckedGroceryList,
  groceryLists,
  token,
  selectedHouseholdId,
  getGroceryLists,
  toggleAddGroceryListDialog,
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
            </div>
        }
        {  lastCheckedGroceryList && groceryLists.length > 0 &&
            <div>
              {JSON.stringify(groceryLists,null,2)}
            </div>
        }
        <Button
          text="Create a Grocery List"
          primary={true}
          onClick={toggleAddGroceryListDialog}
        />
        <AddGroceryListDialog />
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
  toggleAddGroceryListDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    lastCheckedGroceryList: state.getIn([ 'groceryLists', 'state', 'lastChecked' ]),
    groceryLists: state.getIn([ 'groceryLists', 'state', 'lists' ]).toJS(),
    token: state.getIn([ 'credentials', 'token' ]),
    selectedHouseholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroceryLists: (token, householdId) => {
      dispatch(getGroceryLists(token, householdId));
    },
    toggleAddGroceryListDialog: () => {
      dispatch(toggleAddGroceryListDialog());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroceryListComponent);
