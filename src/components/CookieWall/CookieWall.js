/**
 * Cookie wall.
 * @module components/CookieWall
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './CookieWall.css';

/**
 * CookieWallComponent
 * @function CookieWallComponent
 * @param {Function} props.action Set Cookie.
 * @returns {string} Markup of the not found page.
 */
const CookieWallComponent = ({ action }) =>
  <div className={styles.cookieWrapper}>
    <p className={styles.text}>Tippiq gebruikt Cookies.
      { ' ' }
      <Link to="/privacy" className={styles.highLight}>Lees hier waarom.</Link>
      { ' ' }
      Als je doorgaat, accepteer je het gebruik van deze cookies.
    </p>
    <button id="btnAgree" className={styles.button} onClick={action}>Ik ga akkoord</button>
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
CookieWallComponent.propTypes = {
  action: PropTypes.func.isRequired,
};

export default CookieWallComponent;
