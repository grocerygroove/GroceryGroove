import { PropTypes } from 'react';
import React from 'react';

const TextBox = ({
    label,
    isPasswordField = false,
    value = "",
    onChange,
    style,
    errorText = "",
}) => {
var styleOveride = Object.assign({
    text: {},
    label: {},
}, style);
    return (
<div className='textBox'>
  <input
         className='text'
         placeholder={label}
         style={styleOveride.text}
         type={isPasswordField ? "password" : "textbox"}
         onChange={onChange}
         value={value}/>
  <label className='label' style={styleOveride.label}>{label}</label>
  <label className='error'>{errorText}</label>
</div>
    );
};

TextBox.propTypes = {
    label: PropTypes.string.isRequired,
    isPasswordField: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    errorText: PropTypes.string,
};

export default TextBox;
