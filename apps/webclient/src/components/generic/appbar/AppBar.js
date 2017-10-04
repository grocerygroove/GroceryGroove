import MenuIcon from 'react-icons/lib/md/dehaze';
import PropTypes from 'prop-types';
import React from 'react';

const AppBar = ({
  text,
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
    </div>
  );
};

AppBar.propTypes = {
  text: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default AppBar;
