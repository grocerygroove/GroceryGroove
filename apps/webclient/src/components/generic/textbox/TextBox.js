import { PropTypes } from 'react';
import React from 'react';
import styles from './TextBox.css';

const TextBox = ({
    label,
    isPasswordField = false,
    value = "",
    onChange,
}) => {

    return (
<div className={styles.textBox}>
  <input
         className={styles.text}
         placeholder={label}
         type={isPasswordField ? "password" : "textbox"}
         onChange={onChange}
         value={value}/>
  <label className={styles.label}>{label}</label>
</div>
    );
};

TextBox.propTypes = {
    label: PropTypes.string.isRequired,
    isPasswordField: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default TextBox;