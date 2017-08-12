import { PropTypes } from 'react';
import React from 'react';

const SnackBar = ({
  text,
  show = false,
  autoHideDuration = 4000, //4000ms = 4seconds
  onRequestClose,
}) => {
  let classList = [
    'snackbar',
  ];
  if (show) {
    classList.push('show');
    //Following the autoHideDuration, call the requestClose func
    setTimeout(onRequestClose, autoHideDuration);
  }
  return (
    <div className={classList.join(' ')}>
      <span className='text'>{text}</span>
    </div>
  );
};

SnackBar.propTypes = {
  text: PropTypes.string.isRequired,
  show: PropTypes.bool,
  autoHideDuration: PropTypes.int,
  onRequestClose: PropTypes.func.isRequired,
};

export default SnackBar;
