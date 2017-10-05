import MenuIcon from 'react-icons/lib/md/dehaze';
import PropTypes from 'prop-types';
import React from 'react';

const AppBar = ({
  text,
  headerRightElement,
  onButtonClick,
}) => {
  return (
    <div className='appbar'>
      <button
        className='button'
        onClick={onButtonClick}>
        <MenuIcon />
      </button>
      <span className='text'>{text || ''}</span>
      <span className='header-right'>{headerRightElement}</span>
    </div>
  );
};

AppBar.propTypes = {
  text: PropTypes.string,
  headerRightElement: PropTypes.element,
  onButtonClick: PropTypes.func,
};

export default AppBar;
