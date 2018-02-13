import PropTypes from 'prop-types';
import React from 'react';

const Button = ({
  text,
  classNames,
  secondary = false,
  onClick,
  children,
}) => {
  let classList = [
    'button',
    secondary ? 'secondary' : 'primary'
  ];
  if (classNames) {
    classList = [].concat(classList, classNames);
  }
  return (
    <div className={classList.join(' ')}>
      {children}
      { text &&
        <span>{text}</span>
      }
      <div 
        className="overlay"
        onClick={onClick}></div>
    </div>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  classNames: PropTypes.arrayOf(PropTypes.string),
  secondary: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.element,
};

export default Button;
