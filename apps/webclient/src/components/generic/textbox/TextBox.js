import PropTypes from 'prop-types';
import React from 'react';

const TextBox = ({
  label,
  classNames,
  isPasswordField = false,
  value = "",
  onChange,
  style,
  errorText = "",
}) => {
  let classList = [
    'text',
  ];
  if (classNames) {
    classList = [].concat(classList, classNames);
  }
  var styleOveride = Object.assign({
    text: {},
    label: {},
  }, style);
  return (
    <div className='textBox'>
      <input
        className={classList.join(' ')}
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
  classNames: PropTypes.arrayOf(PropTypes.string),
  isPasswordField: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  errorText: PropTypes.string,
};

export default TextBox;
