import IconButton from '../../components/generic/button/IconButton';
import Chip from '../../components/generic/chip/Chip';
import { connect } from 'react-redux';
import { getCategories } from './settings-actions';
import MdAdd from 'react-icons/lib/md/add';
import PageComponent from '../../components/page-component';
import { PropTypes } from 'react';
import React from 'react';

const SettingsComponent = ({
  categories,
  token,
  selectedHousholdId,
  getCategories,
}) => {
  if (categories.length === 0) {
    getCategories(token, selectedHousholdId);
  }

  return (
    <PageComponent pageTitle="Settings">
      <div className="panel">
        <h2 className="panel-heading">Categories</h2>
        {categories.map(x => {
          return (
            //Material UI global theme doesn't respect listItem themeing
            //so we apply it inline as a workaround...
            <Chip text={x.name}/>
          );
        })
        }
        <div className="panel-footer">
          <IconButton
            text="Add Category"
            classNames={["category-button"]}>
            <MdAdd />
          </IconButton>
        </div>
      </div>
    </PageComponent>
  );
};

SettingsComponent.propTypes = {
  categories: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  selectedHousholdId: PropTypes.number.isRequired,
  getCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    categories: state.getIn([ 'settings', 'categories' ]).toJS(),
    token: state.getIn([ 'credentials', 'token' ]),
    selectedHousholdId: state.getIn([ 'user', 'selectedHouseholdId' ]),
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCategories: (token, selectedHousholdId) => {
      dispatch(getCategories(token, selectedHousholdId));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsComponent);
