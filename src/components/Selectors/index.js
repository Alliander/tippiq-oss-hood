/**
 * Selectors component.
 * @module component/Selectors
 */

import React from 'react';
import styles from './Selectors.css';

/**
 * Selectors container.
 * @function Styleguide
 * @returns {string} Markup of the styleguide page.
 */

const Selectors = () =>
  <div className={styles.viewSelectorContainer}>
    <h2>Weergave</h2>
    <div className={`${styles.mainSelector} ${styles.active}`}>
      <i className={`fa fa-heart ${styles.mainSelectorIcon}`} />
      <span className={styles.text}>Mijn selectie</span>
      <i className={`fa fa-cog ${styles.mainSelectorIcon}`} />
    </div>
    <div className={styles.mainSelector}>
      <i className={`fa fa-globe ${styles.mainSelectorIcon}`} />
      <span className={styles.text}>Alle bronnen</span>
    </div>
  </div>;

export default Selectors;
