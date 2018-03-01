import PropTypes from 'prop-types';
import React from 'react';

const TextBox = ({
  label,
  size,
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
  const styleOveride = Object.assign({
    text: {},
    label: {},
  }, style);

  let sizeClass;
  switch (size) {
    case "fill":
      sizeClass = "textBox-fill";
      break;
    case "lg":
      sizeClass = "textBox-lg";
      break;
    case "md":
      sizeClass = "textBox-md";
      break;
    case "sm":
      sizeClass = "textBox-sm";
      break;
    default:
      sizeClass = "textBox-md";
  }
  
  return (
    <div className={`textBox ${sizeClass}`}>
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
  size: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  errorText: PropTypes.string,
};

export default TextBox;
