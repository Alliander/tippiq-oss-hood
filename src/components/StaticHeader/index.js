/**
 * Footer component.
 * @module components/Footer
 */

import React, { PropTypes } from 'react';
import { Row } from 'react-bootstrap';
import { Button } from '../../components';
import styles from './StaticHeader.css';

import piwik from '../../piwik';

/**
 * StaticHeader component class.
 * @function StaticHeader
 * @returns {string} Markup of the component.
 */
const StaticHeader = ({ children, loggedIn }) =>
  <Row className={styles.head}>
    <div className={styles.headTop}>
      <div className={`${styles.split} ${styles.splitFirst}`}>
        {children}
        <span>Meld je aan voor het Buurtbericht en ontdek jouw buurt!</span>
      </div>
      <div className={`${styles.split} ${styles.splitSecond}`}>
        { loggedIn ? null :
          <Button
            url="/registreren"
            className={styles.button}
            responsive
            onClick={
              () =>
                piwik.push(['trackEvent', 'Onboarding', 'Click on register - StaticHeader'])
              }
          >
            Nu aanmelden
          </Button>
        }
      </div>
    </div>
    <div className={styles.headBottom}>
      { loggedIn ?
        null :
        <ul className={styles.listItems}>
          <li><i className={`fa fa-check ${styles.check}`} aria-hidden="true" /> Je kunt het overzicht personaliseren</li>
          <li><i className={`fa fa-check ${styles.check}`} aria-hidden="true" /> Ontvangt wekelijks het buurbericht</li>
          <li><i className={`fa fa-check ${styles.check}`} aria-hidden="true" /> Stel notificaties in voor diensten</li>
        </ul>
      }
    </div>
  </Row>;

StaticHeader.propTypes = {
  children: PropTypes.any,
  loggedIn: PropTypes.bool,
};

export default StaticHeader;
