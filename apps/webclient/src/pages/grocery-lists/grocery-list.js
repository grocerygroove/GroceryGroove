import AddGroceryListDialog from './components/add-grocery-list/add-grocery-list-dialog';
import { addItem } from './components/add-item/add-item-actions';
import AddItemDialog from './components/add-item/add-item-dialog';
import Button from '../../components/generic/button/Button';
import { connect } from 'react-redux';
import { createGroceryList } from './components/add-grocery-list/add-grocery-list-actions';
import { getGroceryLists } from './grocery-lists-actions';
import { getGroceryListItems } from './grocery-lists-actions';
import PageComponent from '../../components/page-component';
import PropTypes from 'prop-types';
import React from 'react';
import { toggleAddItemDialog } from './components/add-item/add-item-actions';
import { toggleAddGroceryListDialog } from './components/add-grocery-list/add-grocery-list-actions';
import { setSelectedGroceryList } from './grocery-lists-actions';

const FIVE_MINS = 1000 * 60 * 5;

const getCategoryGroups = (items) => {

  //Get distinct categories
  const distinctCategories = items.map(x => x.category_name)
    .filter((value, index, arr) => {
      return arr.indexOf(value) === index;
    });

  const mapping = {};
  distinctCategories.forEach(x => {
    mapping[x] = items.filter(y => y.category_name === x);
  });

  return mapping;
};

const GroceryListComponent = ({
  token,
  selectedHouseholdId,
  selectedGroceryListId,
  lastCheckedGroceryList,
  groceryLists,
  groceryListItems,
  addGroceryListDialogVisible,
  addItemDialogVisible,
  categories,
  quantityTypes,

  getGroceryLists,
  getGroceryListItems,
  setSelectedGroceryList,
  toggleAddGroceryListDialog,
  toggleAddItemDialog,
  addGroceryList,
  addItem,
}) => {    
  if (!lastCheckedGroceryList || ((new Date) - lastCheckedGroceryList) > FIVE_MINS) {
    getGroceryLists(token, selectedHouseholdId);
  }
  if(lastCheckedGroceryList && groceryLists.length > 0 && !selectedGroceryListId) {
    setSelectedGroceryList(token, selectedHouseholdId, groceryLists[0].grocery_list_id);
  }

  const categoryGroups = getCategoryGroups(groceryListItems);
  const pageContent = () => {
    if(lastCheckedGroceryList && groceryLists.length == 0) {
      return (
        <div id='noGroceryLists'>
          <p>You don't have any grocery lists. Would you like to add one?</p>
          <Button
            text="Create a Grocery List"
            primary={true}
            onClick={toggleAddGroceryListDialog}
          />
          <AddGroceryListDialog 
            modalVisible={addGroceryListDialogVisible}
            selectedHouseholdId={selectedHouseholdId}
            token={token}
            onCreateClick={addGroceryList}
            toggleDialog={toggleAddGroceryListDialog}/>
        </div>
      );
    } else if(lastCheckedGroceryList && groceryLists.length > 0 && selectedGroceryListId) {
      return (
        <div id='grocery-list-page'>
          <select
            className={'select-grocery-list'}
            onChange={event => setSelectedGroceryList(token, selectedHouseholdId, event.target.value)}>
            {groceryLists.map(x => {
              return (<option key={x.grocery_list_id} value={x.grocery_list_id}>{x.name}</option>);
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
                  <div key={x} className="categoryList">
                    <h2>{x}</h2>
                    { categoryGroups[x].map(y => { return <p key={y}>{JSON.stringify(y)}</p>;
                      })
                    }
                  </div>
                );
              })
            }
          </div>
          <AddItemDialog 
            categories={categories}
            quantityTypes={quantityTypes}
            householdId={selectedHouseholdId}
            groceryListId={selectedGroceryListId}
            token={token}
            modalVisible={addItemDialogVisible}
            onCreateClick={addItem}
            toggleDialog={toggleAddItemDialog}/>
          <AddGroceryListDialog 
            modalVisible={addGroceryListDialogVisible}
            selectedHouseholdId={selectedHouseholdId}
            token={token}
            onCreateClick={addGroceryList}
            toggleDialog={toggleAddGroceryListDialog}/>
        </div>
      );
    } else
      return;
  };

  return (
    <PageComponent pageTitle="Grocery List">
      {pageContent()}
    </PageComponent>
  );
};

GroceryListComponent.propTypes = {
  token: PropTypes.string.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,
  selectedGroceryListId: PropTypes.number,
  lastCheckedGroceryList: PropTypes.object,
  groceryLists: PropTypes.array.isRequired,
  groceryListItems: PropTypes.array.isRequired,
  addGroceryListDialogVisible: PropTypes.bool.isRequired,
  addItemDialogVisible: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
  quantityTypes: PropTypes.array.isRequired,

  toggleAddGroceryListDialog: PropTypes.func.isRequired,
  toggleAddItemDialog: PropTypes.func.isRequired,
  setSelectedGroceryList: PropTypes.func.isRequired,
  getGroceryLists: PropTypes.func.isRequired,
  addGroceryList: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    token: state.getIn([ 'credentials', 'token' ]),
    selectedHouseholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
    selectedGroceryListId: state.getIn([ 'groceryLists', 'state', 'selectedGroceryListId' ]),
    lastCheckedGroceryList: state.getIn([ 'groceryLists', 'state', 'lastChecked' ]),
    groceryLists: state.getIn([ 'groceryLists', 'state', 'lists' ]).toJS(),
    groceryListItems: state.getIn([ 'groceryLists', 'state', 'selectedGroceryListItems' ]).toJS(),
    categories: state.get('categories').toJS(),
    quantityTypes: state.get('quantityTypes').toJS(),

    //Add grocery list dialog
    addGroceryListDialogVisible: state.getIn([ 'groceryLists', 'addGroceryListDialog', 'visible' ]),

    //Add item dialog
    addItemDialogVisible: state.getIn([ 'groceryLists', 'addItemDialog', 'visible' ]),
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
    setSelectedGroceryList: (token, householdId, id) => {
      dispatch(setSelectedGroceryList(token, householdId, parseInt(id)));
    },
    toggleAddGroceryListDialog: () => {
      dispatch(toggleAddGroceryListDialog());
    },
    toggleAddItemDialog: () => {
      dispatch(toggleAddItemDialog());
    },

    addGroceryList: (token, householdId, groceryListName) => {
      dispatch(createGroceryList(token, householdId, groceryListName));
    },

    addItem: (name, category, quantityType, quantity) => {
      dispatch(addItem(name, category, quantityType, quantity));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroceryListComponent);
