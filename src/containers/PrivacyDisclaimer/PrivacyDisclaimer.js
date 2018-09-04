/**
 * PrivacyDisclaimer container.
 * @module components/PrivacyDisclaimer
 */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { StaticPage } from '../../containers';
import { Button } from '../../components';
import styles from './PrivacyDisclaimer.css';

/**
 * PrivacyDisclaimer component.
 * @function PrivacyDisclaimer
 * @returns {string} Markup of the PrivacyDisclaimer page.
 */
const PrivacyDisclaimer = () =>
  <StaticPage title="Privacy & Disclaimer" id="page-privacy-disclaimer">
    <h1>Privacy &amp; Disclaimer</h1>
    <p>
      TODO: Voeg privacydisclaimer toe!
    </p>
    <Row>
      <Col sm={6}>
        <Button
          url="/contact"
          responsive
          className={styles.button}
        >
          Neem dan contact met ons op
        </Button>
      </Col>
    </Row>
  </StaticPage>;

export default PrivacyDisclaimer;
