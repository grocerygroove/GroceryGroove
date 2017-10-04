import PropTypes from 'prop-types';
import React from 'react';

const Chip = ({
  text,
}) => {
  return (
    <div className='chip'>{text}</div>
  );
};

Chip.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Chip;
