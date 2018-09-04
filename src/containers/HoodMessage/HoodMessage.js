/**
 * HoodMessage container.
 * @module containers/HoodMessage
 */

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Col, Row, Grid } from 'react-bootstrap';
import { Footer } from '../../components';
import { Header } from '../../containers';
import email from '../../static/svgIcons/email.svg';
import styles from './HoodMessage.css';

/**
 * HoodMessage page.
 * @function HoodMessage
 * @returns {string} Markup of the HoodMessage page.
 */

const success = () =>
  <Col sm={9} className={styles.contentHolder}>
    <Helmet title="Gelukt! Je hebt je succesvol afgemeld voor het Buurtbericht." />
    <h1 className={styles.headingText}>
      <span className={styles.headingTextColor}>
        Gelukt!
      </span>
    </h1>
    <p>
        Je hebt je succesvol afgemeld voor het Buurtbericht.
    </p>
  </Col>;

const failed = () =>
  <Col sm={9} className={styles.contentHolder}>
    <Helmet title="Mislukt! De gebruiker is niet gevonden, en kon daarom niet worden afgemeld van het Buurtbericht." />
    <h1 className={styles.headingText}>
      <span className={styles.headingTextColor}>
        Mislukt!
      </span>
    </h1>
    <p>
        De gebruiker is niet gevonden, en kon daarom niet worden afgemeld van het Buurtbericht.
    </p>
  </Col>;

const HoodMessage = (props) =>
  <div id="hood-message" className={styles.HoodMessagePage}>
    <Header />
    <Grid className={styles.wrapper}>
      <Row className={styles.mainContent}>
        <Col sm={3} className={styles.imageHolder}>
          <img src={email} alt="Email" width="205" height="205" />
        </Col>
        {props.params.status === 'success' ? success() : failed()}
      </Row>
    </Grid>
    <Footer />
  </div>;

HoodMessage.propTypes = {
  params: PropTypes.object,
};

export default HoodMessage;
