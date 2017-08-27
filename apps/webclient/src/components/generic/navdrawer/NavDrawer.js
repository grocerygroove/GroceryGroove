import { PropTypes } from 'react';
import React from 'react';

const NavDrawer = ({
  open,
  onOutClick,
  children,
}) => {
  return (
    <div
      className={`nav-drawer${open?` open`:''}`}>
      <div className="drawer">
        {children}
      </div>
      <div 
        className="fill"
        onClick={onOutClick}></div>
    </div>
  );
};

NavDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onOutClick: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
};

export default NavDrawer;
