import { PropTypes } from 'react';
import React from 'react';

const Button = ({
  text,
  className,
  secondary = false,
  onClick,
  children,
}) => {
  let classList = [
    'button',
    secondary ? 'secondary' : 'primary'
  ];
  if (className) {
    classList.push(className);
  }
  return (
    <div className={classList.join(' ')}>
      {children}
      <span>{text}</span>
      <div 
        className="overlay"
        onClick={onClick}></div>
    </div>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  secondary: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
