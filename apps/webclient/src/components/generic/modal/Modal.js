import { PropTypes } from 'react';
import styles from './Modal.css';
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
    className={`${styles.modal}${showModal?` ${styles.on}`:''}`}>
    <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
            <div className={styles.headerText}>{headerText}</div>
            <button
                className={styles.closeButton}
                onClick={onCancelClick}>Close</button>
        </div>
        <div className={styles.modalBody}>
            {children}
        </div>
        <div className={styles.modalFooter}>
            <button
                className={styles.confirmButton}
                onClick={onConfirmClick}>{confirmButtonText}</button>
        </div>
    </div>
    <div
        className={styles.fill}
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