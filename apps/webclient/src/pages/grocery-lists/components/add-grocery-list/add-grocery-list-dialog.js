import Modal from '../../../../components/generic/modal/Modal';
import { PropTypes } from 'react';
import React from 'react';
import TextBox from '../../../../components/generic/textbox/TextBox';

class AddGroceryListDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newGroceryListName: "",
    };
  }

  changeNewGroceryListName(event) {
    this.setState({
      newGroceryListName: event.target.value,
    });
  }

  render() {
    const {
      modalVisible,
      selectedHouseholdId,
      token,

      onCreateClick,
      toggleDialog,
    } = this.props;

    const {
      newGroceryListName,
    } = this.state;

    return (
      <Modal
        showModal={modalVisible}
        headerText="Create Grocery List"
        confirmButtonText="Create"
        onCancelClick={toggleDialog}
        onConfirmClick={onCreateClick.bind(null, 
          token,
          selectedHouseholdId, 
          newGroceryListName)}>
        <TextBox
          label="Grocery List Name"
          value={newGroceryListName}
          onChange={this.changeNewGroceryListName.bind(this)}/>
      </Modal>
    );
  }
}

AddGroceryListDialog.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,

  onCreateClick: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

export default AddGroceryListDialog;
