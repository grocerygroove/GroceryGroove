import AddGroceryListDialog from './components/add-grocery-list/add-grocery-list-dialog';
import AddItemDialog from './components/add-item/add-item-dialog';
import Button from '../../components/generic/button/Button';
import { connect } from 'react-redux';
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
  categories,
  quantityTypes,

  getGroceryLists,
  getGroceryListItems,
  setSelectedGroceryList,
  toggleAddGroceryListDialog,
  toggleAddItemDialog,
}) => {    
  if (!lastCheckedGroceryList || ((new Date) - lastCheckedGroceryList) > FIVE_MINS) {
    getGroceryLists(token, selectedHouseholdId);
  }
  if(lastCheckedGroceryList && groceryLists.length > 0 && !selectedGroceryListId) {
    setSelectedGroceryList(token, selectedHouseholdId, groceryLists[0].grocery_list_id);
  }

  const categoryGroups = getCategoryGroups(groceryListItems);
  const selectedGroceryList = groceryLists.filter(x => x.grocery_list_id == selectedGroceryListId)[0];

  const pageContent = () => {
    if(lastCheckedGroceryList && groceryLists.length == 0) {
      return (
        <div id='noGroceryLists'>
          <p>You don't currently have any grocery lists.</p>
          <AddGroceryListDialog 
            selectedHouseholdId={selectedHouseholdId}
            token={token}
            toggleDialog={toggleAddGroceryListDialog}/>
        </div>
      );
    } else if(lastCheckedGroceryList && groceryLists.length > 0 && selectedGroceryListId) {
      return (
        <div id='grocery-list-page'>
          <div id='grocery-list'>
            <div id='grocery-list-header'>
              <h1>{selectedGroceryList.name}</h1>
              <Button
                classNames={[ 'add-item-button', 'pull-right' ]}
                text="Add Item"
                primary={true}
                onClick={toggleAddItemDialog}
              />
            </div>
            {
              Object.keys(categoryGroups).filter(x => categoryGroups.hasOwnProperty(x)).length == 0 &&
                <p>You don't currently have any items.</p>
            }
            {
              Object.keys(categoryGroups).filter(x => categoryGroups.hasOwnProperty(x)).map(x => {
                return (
                  <div key={x} className="categoryList">
                    <h2 className="category-header">{x}</h2>
                    <div className="category-items">
                      { categoryGroups[x].map(y => { 
                        return <div key={y.grocery_list_item_id}
                                    className="category-item">
                          <input type="checkbox" 
                            className="item-check"/> 
                          <span className="item-name">{y.item_name}</span>
                          <span className="item-quantity">{y.quantity}</span>
                          <span className="item-quantity-type">
                            {y.quantity == 1 ? y.singular_name : y.plural_name || y.singular_name}
                          </span>
                          <span className="item-added-by">{y.added_by_nickname}</span>
                        </div>;
                      })}
                    </div>
                  </div>
                );
              })
            }
          </div>
          <AddItemDialog 
            categories={categories}
            quantityTypes={quantityTypes}
            selectedHouseholdId={selectedHouseholdId}
            selectedGroceryListId={selectedGroceryListId}
            token={token}
            toggleDialog={toggleAddItemDialog}/>
          <AddGroceryListDialog 
            selectedHouseholdId={selectedHouseholdId}
            token={token}
            toggleDialog={toggleAddGroceryListDialog}/>
        </div>
      );
    } else
      return;
  };

  return (
    <PageComponent 
      pageTitle="Grocery List"
      headerRightElement={
          <Button
            classNames={[ 'add-grocery-list-button' ]}
            text="Create a Grocery List"
            primary={true}
            onClick={toggleAddGroceryListDialog}
          />
      }>
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
  categories: PropTypes.array.isRequired,
  quantityTypes: PropTypes.array.isRequired,

  toggleAddGroceryListDialog: PropTypes.func.isRequired,
  toggleAddItemDialog: PropTypes.func.isRequired,
  setSelectedGroceryList: PropTypes.func.isRequired,
  getGroceryLists: PropTypes.func.isRequired,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroceryListComponent);
