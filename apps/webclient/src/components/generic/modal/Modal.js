import Button from '../button/Button';
import { PropTypes } from 'react';
import React from 'react';


const Modal = ({
  showModal,
  allowClickout = true,
  headerText,
  confirmButtonText = "Confirm",
  onCancelClick,
  onConfirmClick = ()=>{}, //Default to an empty function
  children,
}) => {
  const onClickout = (event) => {
    if (event.target.classList.contains(styles.fill)) {
      onCancelClick();
    }
  };
  return (
    <div
      className={`modal${showModal?` on`:''}`}>
      <div className='modalContent'>
        <div className='modalHeader'>
          <div className='headerText'>{headerText}</div>
          <button
            className='closeButton'
            onClick={onCancelClick}>Close</button>
        </div>
        <div className='modalBody'>
          {children}
        </div>
        <div className='modalFooter'>
          <Button
            classNames={['confirmButton']}
            text={confirmButtonText}
            onClick={onConfirmClick} />
        </div>
      </div>
      <div
        className='fill'
        onClick={onClickout}></div>
    </div>
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  allowClickout: PropTypes.bool,
  headerText: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string,
  onCancelClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.element),
};

export default Modal;
