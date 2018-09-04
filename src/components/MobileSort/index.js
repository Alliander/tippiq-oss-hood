/**
 * Mobile sort component.
 * @module components/MobileSort
 */

import React, { PropTypes } from 'react';
import {
  Button,
  Modal,
} from 'react-bootstrap';

const labels = {
  diversify: 'Divers',
  distance: 'Afstand',
  new: 'Nieuwste',
};

/**
 * Sort component class.
 * @function Sort
 * @returns {string} Markup of the sort component.
 */
const Sort = ({ checked, onChange, label, name, value }) =>
  <div className="radio">
    <input
      id={value}
      onChange={onChange}
      type="radio"
      checked={checked}
      name={name}
      value={value}
    /><label htmlFor={value}>{label}</label>
  </div>;

Sort.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
};

/**
 * Mobile sort component class.
 * @function MobileSort
 * @returns {string} Markup of the mobile sort component.
 */
const MobileSort = ({ current, open, setSort, onOpen }) =>
  <Button onClick={onOpen}>
    Sorteren
    <Modal show={open}>
      <Modal.Header>
        <Modal.Title>Sorteer op:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <Sort name="sort" value="diversify" checked={current === 'diversify'} onChange={setSort} label={labels.diversify} />
          <Sort name="sort" value="distance" checked={current === 'distance'} onChange={setSort} label={labels.distance} />
          <Sort name="sort" value="new" checked={current === 'new'} onChange={setSort} label={labels.new} />
        </form>
      </Modal.Body>
    </Modal>
  </Button>;

MobileSort.propTypes = {
  current: PropTypes.string,
  open: PropTypes.bool,
  setSort: PropTypes.func,
  onOpen: PropTypes.func,
};

export default MobileSort;
