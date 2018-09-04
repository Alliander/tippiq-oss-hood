/**
 * Partner view component.
 * @module components/Partner
 */

import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from './Partner.css';

/**
 * Partner view component class.
 * @function Partner
 * @returns {string} Markup of the Partner component.
 */

const Partner = ({ partner }) =>
  <Row>
    <Col sm={4}>
      {partner.images && partner.images.partnerpage &&
        <img src={partner.images.partnerpage} alt={partner.name} />
      }
    </Col>
    <Col sm={8} className={styles.partnerContent}>
      <h4>{partner.name}</h4>
      <p>{partner.shortDescription}</p>
      <a href={partner.url} rel="noopener noreferrer" target="_blank">Naar {partner.name}</a>
    </Col>
  </Row>;

Partner.propTypes = {
  partner: PropTypes.object,
};

export default Partner;
