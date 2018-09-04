/**
 * CheckEmail container.
 * @module containers/CheckEmail
 */

import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { Col, Row, Grid } from 'react-bootstrap';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Footer } from '../../components';
import { Header } from '../../containers';
import { setWeeklyEnabled } from '../../actions';

import email from '../../static/svgIcons/email.svg';
import styles from './CheckEmail.css';

import piwik from '../../piwik';

/**
 * CheckEmail container.
 * @class CheckEmail
 */
export class CheckEmail extends Component {

  static propTypes = {
    placeId: PropTypes.string,
    setWeeklyEnabled: PropTypes.func.isRequired,
    location: PropTypes.object,
  };

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.setWeeklyEnabled(this.props.placeId, true);
    const track = get(this.props, 'location.query.track');
    if (track) {
      piwik.push(['trackEvent', 'Register flow', `Check your mail (step 2) - go to step 3 - track: ${track}`]);
    }
  }

  /**
   * render page.
   * @function render
   * @returns {string} Markup of the component
   */
  render() {
    return (
      <div id="check-email" className={styles.checkEmailPage}>
        <Helmet title="Gelukt! Check je mail" />
        <Header hideMenu />
        <Grid className={styles.wrapper}>
          <Row className={styles.mainContent}>
            <Col sm={3} className={styles.imageHolder}>
              <img src={email} alt="Email" width="205" height="205" />
            </Col>
            <Col sm={9} className={styles.contentHolder}>
              <h1 className={styles.headingText}>
                <span className={styles.headingTextColor}>
                  Gelukt!
                </span> Check je mail
              </h1>
              <p>
                We hebben je een bevestigingsmail gestuurd. <br />
                Klik op de link in je mail om je aanmelding af te ronden.
              </p>
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}
export default connect(
  state => ({
    placeId: state.userSession.placeId,
  }), ({ setWeeklyEnabled })
)(CheckEmail);
