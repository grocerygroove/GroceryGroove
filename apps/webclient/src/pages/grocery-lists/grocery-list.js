import AddGroceryListDialog from './components/add-grocery-list-dialog';
import Button from '../../components/generic/button/Button';
import { connect } from 'react-redux';
import { getGroceryLists } from './grocery-lists-actions';
import { getGroceryListItems } from './grocery-lists-actions';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';
import { toggleAddGroceryListDialog } from './components/add-grocery-list-actions';
import { setSelectedGroceryList } from './grocery-lists-actions';

const FIVE_MINS = 1000 * 60 * 5;

const GroceryListComponent = ({
  lastCheckedGroceryList,
  groceryLists,
  token,
  selectedHouseholdId,
  selectedGroceryListId,
  groceryListItems,
  getGroceryLists,
  getGroceryListItems,
  toggleAddGroceryListDialog,
  setSelectedGroceryList,
}) => {    
  if (!lastCheckedGroceryList || ((new Date) - lastCheckedGroceryList) > FIVE_MINS) {
    getGroceryLists(token, selectedHouseholdId);
  }
  if(lastCheckedGroceryList && groceryLists.length > 0 && !selectedGroceryListId) {
    setSelectedGroceryList(groceryLists[0].grocery_list_id);
    getGroceryListItems(token, selectedHouseholdId, groceryLists[0].grocery_list_id);
  }

  return (
    <PageComponent pageTitle="Grocery List">
      {  lastCheckedGroceryList && groceryLists.length == 0 &&
          <div id='noGroceryLists'>
            <p>You don't have any grocery lists. Would you like to add one?</p>
            <Button
              text="Create a Grocery List"
              primary={true}
              onClick={toggleAddGroceryListDialog}
            />
            <AddGroceryListDialog />
          </div>
      }
      {  lastCheckedGroceryList && groceryLists.length > 0 && selectedGroceryListId &&
          <div id='grocery-list-page'>
            <select
              className={'select-grocery-list'}
              onChange={event => setSelectedGroceryList(event.target.value)}>
              {groceryLists.map(x => {
                return (<option value={x.grocery_list_id}>{x.name}</option>);
              })}
            </select>
            <Button
              classNames={[ 'add-grocery-list-button' ]}
              text="Create a Grocery List"
              primary={true}
              onClick={toggleAddGroceryListDialog}
            />
            <div className="other-content">
              {JSON.stringify(groceryLists,null,2)}
            </div>
            <AddGroceryListDialog />
          </div>
      }
    </PageComponent>
  );
};

GroceryListComponent.propTypes = {
  lastCheckedGroceryList: PropTypes.object,
  groceryLists: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,
  selectedGroceryListId: PropTypes.number,
  getGroceryLists: PropTypes.func.isRequired,
  toggleAddGroceryListDialog: PropTypes.func.isRequired,
  setSelectedGroceryList: PropTypes.func.isRequired,
  groceryListItems: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    lastCheckedGroceryList: state.getIn([ 'groceryLists', 'state', 'lastChecked' ]),
    groceryLists: state.getIn([ 'groceryLists', 'state', 'lists' ]).toJS(),
    token: state.getIn([ 'credentials', 'token' ]),
    selectedHouseholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
    selectedGroceryListId: state.getIn([ 'groceryLists', 'state', 'selectedGroceryListId' ]),
    groceryListItems: state.getIn([ 'groceryLists', 'state', 'selectedGroceryListItems' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroceryLists: (token, householdId) => {
      dispatch(getGroceryLists(token, householdId));
    },
    getGroceryListItems: (token, householdId, groceryListId) => {
      dispatch(getGroceryListItems(token, householdId, groceryListId));
    },
    toggleAddGroceryListDialog: () => {
      dispatch(toggleAddGroceryListDialog());
    },
    setSelectedGroceryList: (id) => {
      dispatch(setSelectedGroceryList(parseInt(id)));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroceryListComponent);
