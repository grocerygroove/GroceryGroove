import AddGroceryListDialog from './components/add-grocery-list-dialog';
import AddItemDialog from './components/add-item-dialog';
import Button from '../../components/generic/button/Button';
import { connect } from 'react-redux';
import { getGroceryLists } from './grocery-lists-actions';
import { getGroceryListItems } from './grocery-lists-actions';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';
import { toggleAddItemDialog } from './components/add-item-actions';
import { toggleAddGroceryListDialog } from './components/add-grocery-list-actions';
import { setSelectedGroceryList } from './grocery-lists-actions';

const FIVE_MINS = 1000 * 60 * 5;

const getCategoryGroups = (items) => {

  //Get distinct categories
  const categories = items.map(x => x.category_name)
    .filter((value, index, arr) => {
      return arr.indexOf(value) === index;
    });

  const mapping = {};
  categories.forEach(x => {
    mapping[x] = items.filter(y => y.category_name === x);
  });

  return mapping;
};

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
  toggleAddItemDialog,
  setSelectedGroceryList,
}) => {    
  if (!lastCheckedGroceryList || ((new Date) - lastCheckedGroceryList) > FIVE_MINS) {
    getGroceryLists(token, selectedHouseholdId);
  }
  if(lastCheckedGroceryList && groceryLists.length > 0 && !selectedGroceryListId) {
    setSelectedGroceryList(token, selectedHouseholdId, groceryLists[0].grocery_list_id);
  }

  const categoryGroups = getCategoryGroups(groceryListItems);

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
              onChange={event => setSelectedGroceryList(token, selectedHouseholdId, event.target.value)}>
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
              <Button
                classNames={[ 'add-item-button' ]}
                text="Add Item"
                primary={true}
                onClick={toggleAddItemDialog}
              />
              {
                Object.keys(categoryGroups).map(x => {
                  return (
                    <div className="categoryList">
                      <h2>{x}</h2>
                      {
                        categoryGroups[x].map(y => {
                          return <p>{JSON.stringify(y)}</p>;
                        })
                      }
                    </div>
                  );
                })
              }
            </div>
            <AddItemDialog />
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
  toggleAddItemDialog: PropTypes.func.isRequired,
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
    groceryListItems: state.getIn([ 'groceryLists', 'state', 'selectedGroceryListItems' ]).toJS(),
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
    toggleAddItemDialog: () => {
      dispatch(toggleAddItemDialog());
    },
    setSelectedGroceryList: (token, householdId, id) => {
      dispatch(setSelectedGroceryList(token, householdId, parseInt(id)));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroceryListComponent);
