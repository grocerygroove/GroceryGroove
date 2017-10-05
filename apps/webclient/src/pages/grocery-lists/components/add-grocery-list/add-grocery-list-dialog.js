import { connect } from 'react-redux';
import { createGroceryList } from './add-grocery-list-actions';
import Modal from '../../../../components/generic/modal/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import TextBox from '../../../../components/generic/textbox/TextBox';

class AddGroceryListDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newGroceryListName: "",
      nameErrorText: "",
    };
  }

  changeNewGroceryListName(event) {
    this.setState({
      newGroceryListName: event.target.value,
    });
  }

  onCreateClick() {
    const {
      token,
      selectedHouseholdId,
    } = this.props;

    const {
      newGroceryListName,
    } = this.state;

    if(!newGroceryListName || newGroceryListName.length == 0) {
      this.setState((prevState) => {
        return Object.assign(prevState, {
          nameErrorText: "This field is required",
        });
      });
      return;
    } else {
      this.props.addGroceryList(
        token,
        selectedHouseholdId,
        newGroceryListName
      );
    }
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
      nameErrorText,
    } = this.state;

    return (
      <Modal
        showModal={modalVisible}
        headerText="Create Grocery List"
        confirmButtonText="Create"
        onCancelClick={toggleDialog}
        onConfirmClick={this.onCreateClick.bind(this)}>
        <TextBox
          label="Grocery List Name"
          value={newGroceryListName}
          errorText={nameErrorText}
          onChange={this.changeNewGroceryListName.bind(this)}/>
      </Modal>
    );
  }
}

AddGroceryListDialog.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,

  toggleDialog: PropTypes.func.isRequired,
  addGroceryList: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    modalVisible: state.getIn([ 'groceryLists', 'addGroceryListDialog', 'visible' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    addGroceryList: (token, householdId, groceryListName) => {
      dispatch(createGroceryList(token, householdId, groceryListName));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGroceryListDialog);
