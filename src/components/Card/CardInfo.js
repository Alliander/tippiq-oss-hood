/**
 * CardInfo component.
 * @module component/Card/CardInfo
 */

import React, { PropTypes } from 'react';

import styles from './CardInfo.css';

/**
 * CardInfo component.
 * @function CardInfo
 * @returns {string} Markup of the CardInfo component.
 */

const CardInfo = ({ children, logo, title, position }) =>
  <div className={`${styles.cardInfo} ${position ? styles.bottom : ''}`}>
    { (logo) ? (<i className={styles.logo} style={{ backgroundImage: `url(${logo})` }} />) : null }
    <span className={styles.title}>{title}</span>
    <span className={styles.actions}>
      {children}
    </span>
  </div>;

CardInfo.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string,
  logo: PropTypes.string,
  position: PropTypes.string,
};

export default CardInfo;
