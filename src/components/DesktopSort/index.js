/**
 * Desktop sort component.
 * @module components/DesktopSort
 */

import React, { PropTypes } from 'react';
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';

import styles from './DesktopSort.css';

const labels = {
  diversify: 'Divers',
  distance: 'Afstand',
  new: 'Nieuwste',
};

/**
 * Desktop sort component class.
 * @function DesktopSort
 * @returns {string} Markup of the desktop sort component.
 */
const DesktopSort = ({ current, setSort }) =>
  <div className={styles.wrapper}>
    <span>Sorteer:</span>
    <DropdownButton onSelect={setSort} bsStyle="link" className={styles.dropDownbutton} title={labels[current]} key={1} id="sort">
      <MenuItem eventKey="diversify">{labels.diversify}</MenuItem>
      <MenuItem eventKey="distance">{labels.distance}</MenuItem>
      <MenuItem eventKey="new">{labels.new}</MenuItem>
    </DropdownButton>
  </div>;

DesktopSort.propTypes = {
  current: PropTypes.string,
  setSort: PropTypes.func,
};

export default DesktopSort;
