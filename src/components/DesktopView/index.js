/**
 * Desktop view component.
 * @module components/DesktopSort
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './DesktopView.css';

/**
 * Desktop view component class.
 * @function DesktopView
 * @returns {string} Markup of the desktop view component.
 */

const DesktopView = () =>
  <div className={styles.wrapper}>
    <span>Weergave:</span>
    <Button bsStyle="link" className={styles.button}>
      <i className={`fa fa-th-large ${styles.text}`} />
      Lijst
    </Button>
    <Button bsStyle="link" className={styles.button}>
      <i className={`fa fa-map-marker ${styles.text}`} />
      Kaart
    </Button>
  </div>;

export default DesktopView;

