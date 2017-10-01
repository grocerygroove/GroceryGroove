import Button from './Button';
import { PropTypes } from 'react';
import React from 'react';

const IconButton = ({
  text,
  classNames,
  secondary = false,
  onClick,
  children,
}) => {
  let classList = [
    'icon-button',
  ];
  if (classNames) {
    classList = [].concat(classList, classNames);
  }
  return (
    <Button
      text={text}
      classNames={classList}
      secondary={secondary}
      onClick={onClick}
      children={children} />
  );
}

IconButton.propTypes = {
  text: PropTypes.string,
  classNames: PropTypes.arrayOf(PropTypes.string),
  secondary: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.element,
};

export default IconButton;
