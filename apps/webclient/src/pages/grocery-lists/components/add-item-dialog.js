import { ADD_ITEM_NAME_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_DESCRIPTION_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_CATEGORY_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_QUANTITY_TYPE_CREDENTIAL } from './add-item-actions';
import { ADD_ITEM_QUANTITY_CREDENTIAL } from './add-item-actions';
import { addItem } from './add-item-actions';
import { addItemCredentialChange } from './add-item-actions';
import { toggleAddItemDialog } from './add-item-actions';
import { connect } from 'react-redux';
import Modal from '../../../components/generic/modal/Modal';
import { PropTypes } from 'react';
import React from 'react';
import TextBox from '../../../components/generic/textbox/TextBox';

const AddItemDialog = ({
  categories,
  quantityTypes,
  selectedGroceryListId,
  selectedHouseholdId,
  token,
  addItemDialogVisible,

  itemName,
  itemDescription,
  itemCategory,
  itemQuantityType,
  itemQuantity,
  

  onValueChange,
  onCreateClick,
  toggleDialog,
}) => {
  return (
    <Modal
      showModal={addItemDialogVisible}
      headerText="Add Grocery List Item"
      confirmButtonText="Add"
      onCancelClick={toggleDialog}
      onConfirmClick={onCreateClick.bind(null,
        itemName,
        itemDescription,
        itemCategory,
        itemQuantityType,
        itemQuantity
      )}>
      <TextBox
        label="Name"
        value={itemName}
        onChange={onValueChange.bind(null, ADD_ITEM_NAME_CREDENTIAL)}/>
      <TextBox
        label="Description"
        value={itemDescription || ""}
        onChange={onValueChange.bind(null, ADD_ITEM_DESCRIPTION_CREDENTIAL)}/>
      <select
        className={'categories-select'}
        onChange={onValueChange.bind(null, ADD_ITEM_CATEGORY_CREDENTIAL)}>
        {categories.map(x => {
          return (<option value={x.name}>{x.name}</option>);
        })}
      </select>
      <select
        className={'quantity-types-select'}
        onChange={onValueChange.bind(null, ADD_ITEM_CATEGORY_CREDENTIAL)}>
        {quantityTypes.map(x => {
          return (<option value={x.quantity_type_id}>{x.singular_name}</option>);
        })}
      </select>
      <TextBox
        label="Quantity"
        value={itemQuantity}
        onChange={onValueChange.bind(null, ADD_ITEM_QUANTITY_CREDENTIAL)}/>
    </Modal>
  );
};

AddItemDialog.propTypes = {
  categories: PropTypes.array.isRequired,
  quantityTypes: PropTypes.array.isRequired,
  selectedGroceryListId: PropTypes.number.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  addItemDialogVisible: PropTypes.bool.isRequired,
  itemName: PropTypes.string.isRequired,
  itemDescription: PropTypes.string.isRequired,
  itemCategory: PropTypes.number.isRequired,
  itemQuantityType: PropTypes.number.isRequired,
  itemQuantity: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    categories: state.get('categories').toJS(),
    quantityTypes: state.get('quantityTypes').toJS(),
    selectedGroceryListId: state.getIn([ 'groceryLists', 'state', 'selectedGroceryListId' ]),
    selectedHouseholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
    token: state.getIn([ 'credentials', 'token' ]),
    addItemDialogVisible: state.getIn([ 'groceryLists', 'addItemDialog', 'visible' ]),
    itemName: state.getIn([ 'groceryLists', 'addItemDialog', 'name' ], ""),
    itemDescription: state.getIn([ 'groceryLists', 'addItemDialog', 'description' ]),
    itemCategory: state.getIn([ 'groceryLists', 'addItemDialog', 'category' ]),
    itemQuantityType: state.getIn([ 'groceryLists', 'addItemDialog', 'quantityType' ]),
    itemQuantity: state.getIn([ 'groceryLists', 'addItemDialog', 'quantity' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    onValueChange: (credentialType, event) => {
      dispatch(addItemCredentialChange(credentialType, event.target.value));
    },
    onCreateClick: (name, description, category, quantityType, quantity) => {
      dispatch(addItem(name, description, category, quantityType, quantity));
    },
    toggleDialog: () => {
      dispatch(toggleAddItemDialog());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddItemDialog);
