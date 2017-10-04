import Modal from '../../../../components/generic/modal/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import TextBox from '../../../../components/generic/textbox/TextBox';

class AddItemDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      category: this.props.categories[0].name,
      quantityType: this.props.quantityTypes[0].quantity_type_id,
      quantity: "1",
    };
  }

  changeName(event) {
    event.persist();
    this.setState((prevState) =>{
      return Object.assign(prevState,{
        name: event.target.value,
      });
    });
  }

  changeDescription(event) {
    event.persist();
    this.setState((prevState) =>{
      return Object.assign(prevState,{
        description: event.target.value,
      });
    });
  }

  changeCategory(event) {
    event.persist();
    this.setState((prevState) =>{
      return Object.assign(prevState,{
        category: event.target.value,
      });
    });
  }

  changeQuantityType(event) {
    event.persist();
    this.setState((prevState) =>{
      return Object.assign(prevState,{
        quantityType: event.target.value,
      });
    });
  }

  changeQuantity(event) {
    event.persist();
    this.setState((prevState) =>{
      return Object.assign(prevState,{
        quantity: event.target.value,
      });
    });
  }

  render() {
    const {
      categories,
      quantityTypes,
      groceryListId,
      householdId,
      token,
      modalVisible,

      onCreateClick,
      toggleDialog,
    } = this.props;

    const {
      name,
      description,
      category,
      quantityType,
      quantity,
    } = this.state;

    return (
      <Modal
        showModal={modalVisible}
        headerText="Add Grocery List Item"
        confirmButtonText="Add"
        onCancelClick={toggleDialog}
        onConfirmClick={onCreateClick.bind(null,
          name,
          description,
          category,
          quantityType,
          quantity
        )}>
        <TextBox
          label="Name"
          value={name}
          onChange={this.changeName.bind(this)}/>
        <TextBox
          label="Description"
          value={description || ""}
          onChange={this.changeDescription.bind(this)}/>
        <select
          className={'categories-select'}
          onChange={this.changeCategory.bind(this)}>
          {categories.map(x => {
            return (<option key={x.name} value={x.name}>{x.name}</option>);
          })}
        </select>
        <select
          className={'quantity-types-select'}
          onChange={this.changeQuantityType.bind(this)}>
          {quantityTypes.map(x => {
            return (<option key={x.quantity_type_id} value={x.quantity_type_id}>{x.singular_name}</option>);
          })}
        </select>
        <TextBox
          label="Quantity"
          value={quantity}
          onChange={this.changeQuantity.bind(this)}/>
      </Modal>
    );
  }
}

AddItemDialog.propTypes = {
  categories: PropTypes.array.isRequired,
  quantityTypes: PropTypes.array.isRequired,
  groceryListId: PropTypes.number.isRequired,
  householdId: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,

  onCreateClick: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

export default AddItemDialog;
