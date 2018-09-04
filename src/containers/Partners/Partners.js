/**
 * Partners container.
 * @module components/Partners
 */

import React, { PropTypes, Component } from 'react';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { StaticPage } from '../../containers';
import { Partner } from '../../components';

import { getServices } from '../../actions';

/**
 * Partners container.
 * @class Partners
 */
export class Partners extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    services: PropTypes.object,
    getServices: PropTypes.func.isRequired,
    error: PropTypes.bool,
    pending: PropTypes.bool,
  }

  /**
   * renders.
   * @function renders
   * @returns {string} Markup of the container.
   */
  render() {
    const { services } = this.props;
    return (
      <StaticPage title="Partners" id="page-partners">
        <h1>Partners</h1>
        <p>
          Hieronder vind je een overzicht van alle partners die bij Tippiq Buurt zijn
          aangesloten en waarmee we het Buurtoverzicht samenstellen.
          We werken er hard aan dit aanbod uit te breiden.
        </p>
        <Row>
          <Col sm={6}>
            <Link to="/partners/partner-worden" className="btn btn-primary btn-block">
              Partner worden
            </Link>
          </Col>
        </Row>
        <h1>Aangesloten partners</h1>
        { services && !services.error && !services.pending && services.services
          && services.services.map((service, i) =>
          (<Partner partner={service} key={i} />)
        )}
      </StaticPage>
    );
  }
}

export default compose(
  asyncConnect(
    [
      {
        key: 'services',
        promise: ({ store: { dispatch } }) =>
          dispatch(getServices()),
      },
    ]
  ),
  connect(
    state => ({
      services: state.services,
    }), ({
      getServices,
    })
  ),
)(Partners);
