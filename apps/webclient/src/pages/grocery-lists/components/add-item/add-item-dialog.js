import { addItem } from './add-item-actions';
import { connect } from 'react-redux';
import Modal from '../../../../components/generic/modal/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import TextBox from '../../../../components/generic/textbox/TextBox';

class AddItemDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameErrorText: "",
      category: this.props.categories[0].category_id,
      quantityType: this.props.quantityTypes[0].quantity_type_id,
      quantity: "1",
      quantityErrorText: "",
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

  onCreateClick() {
    const {
      token,
      selectedHouseholdId,
      selectedGroceryListId,
    } = this.props;

    const {
      name,
      category,
      quantityType,
      quantity,
    } = this.state;


    //Check a couple things
    let errors = false;
    if(name.length < 1) {
      this.setState(prevState => {
        return Object.assign(prevState, {
          nameErrorText: "This field is required",
        });
      });
      errors = true;
    } else {
      this.setState(prevState => {
        return Object.assign(prevState, {
          nameErrorText: "",
        });
      });
    }
    if(isNaN(parseFloat(quantity))) {
      this.setState(prevState => {
        return Object.assign(prevState, {
          quantityErrorText: "Must be a number (Ex: 1 or 1.5)",
        });
      });
      errors = true;
    } else {
      this.setState(prevState => {
        return Object.assign(prevState, {
          quantityErrorText: "",
        });
      });
    }

    if(errors)
      return;

    this.props.addItem(
      token,
      selectedHouseholdId,
      selectedGroceryListId,
      name,
      category,
      quantityType,
      quantity
    );
  }

  render() {
    const {
      modalVisible,
      categories,
      quantityTypes,
      selectedGroceryListId,
      selectedHouseholdId,
      token,

      onCreateClick,
      toggleDialog,
    } = this.props;

    const {
      name,
      nameErrorText,
      category,
      quantityType,
      quantity,
      quantityErrorText,
    } = this.state;

    return (
      <Modal
        showModal={modalVisible}
        headerText="Add Grocery List Item"
        confirmButtonText="Add"
        onCancelClick={toggleDialog}
        onConfirmClick={this.onCreateClick.bind(this)}>
        <TextBox
          label="Name"
          value={name}
          errorText={nameErrorText}
          onChange={this.changeName.bind(this)}/>
        <div>
          <span>
            Category: 
            <select
              className={'categories-select'}
              onChange={this.changeCategory.bind(this)}>
              {categories.map(x => {
                return (<option key={x.category_id} value={x.category_id}>{x.name}</option>);
              })}
            </select>
          </span>
        </div>
        <div className={'relative'}>
          <span>
            <TextBox
              label="Quantity"
              classNames={['width-10-ch']}
              value={quantity}
              errorText={quantityErrorText}
              onChange={this.changeQuantity.bind(this)}/>
            <span className={'quantity-types-span'}>
              Quantity Type: 
              <select
                className={'quantity-types-select'}
                onChange={this.changeQuantityType.bind(this)}>
                {quantityTypes.map(x => {
                  return (<option key={x.quantity_type_id} value={x.quantity_type_id}>{x.singular_name}</option>);
                })}
              </select>
            </span>
          </span>
        </div>
      </Modal>
    );
  }
}

AddItemDialog.propTypes = {
  categories: PropTypes.array.isRequired,
  quantityTypes: PropTypes.array.isRequired,
  selectedGroceryListId: PropTypes.number.isRequired,
  selectedHouseholdId: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,

  toggleDialog: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    modalVisible: state.getIn([ 'groceryLists', 'addItemDialog', 'visible' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (
      token,
      selectedhouseholdid,
      selectedgrocerylistid,
      name,
      category,
      quantitytype,
      quantity) => {

        dispatch(addItem(
          token,
          selectedhouseholdid,
          selectedgrocerylistid,
          name,
          category,
          quantitytype,
          quantity));
      },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddItemDialog);
