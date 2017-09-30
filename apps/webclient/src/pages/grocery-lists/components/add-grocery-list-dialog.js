import { connect } from 'react-redux';
import { changeGroceryListName } from './add-grocery-list-actions';
import { createGroceryList } from './add-grocery-list-actions';
import Modal from '../../../components/generic/modal/Modal';
import { PropTypes } from 'react';
import React from 'react';
import TextBox from '../../../components/generic/textbox/TextBox';
import { toggleAddGroceryListDialog } from './add-grocery-list-actions';

const AddGroceryListDialog = ({
  addGroceryListDialogVisible,
  groceryListName,
  token,
  selectedHouseholdId,
  onGroceryListChange,
  onCreateClick,
  toggleDialog,
}) => {
  return (
    <Modal
      showModal={addGroceryListDialogVisible}
      headerText="Create Grocery List"
      confirmButtonText="Create"
      onCancelClick={toggleDialog}
      onConfirmClick={onCreateClick.bind(null, groceryListName, selectedHouseholdId, token)}>
      <TextBox
        label="Grocery List Name"
        value={groceryListName}
        onChange={onGroceryListChange}/>
    </Modal>
  );
};

AddGroceryListDialog.propTypes = {
  addGroceryListDialogVisible: PropTypes.bool.isRequired,
  groceryListName: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,
  onGroceryListChange: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    addGroceryListDialogVisible: state.getIn([ 'groceryLists', 'addGroceryListDialog', 'visible' ]),
    groceryListName: state.getIn([ 'groceryLists', 'addGroceryListDialog', 'name' ]),
    token: state.getIn([ 'credentials', 'token' ]),
    selectedHouseholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateClick: (groceryListName, householdId, token) => {
      dispatch(createGroceryList(householdId, token, groceryListName));
    },
    onGroceryListChange: (event) => {
      dispatch(changeGroceryListName(event.target.value));
    },
    toggleDialog: () => {
      dispatch(toggleAddGroceryListDialog());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGroceryListDialog);
