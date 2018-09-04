/**
 * Source container.
 * @module containers/Source
 */

import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { find, isEqual, slice } from 'lodash';

import {
  Col,
  Grid,
  Row,
} from 'react-bootstrap';

import {
  Button,
  Footer,
  MasonryGrid,
  SharePopup,
  StaticHeader,
} from '../../components';

import {
  Header,
} from '../../containers';

import { getCards, getServices, getCityGeometry } from '../../actions';
import styles from './Source.css';

import piwik from '../../piwik';

/**
 * Source container.
 * @class Source
 */
export class Source extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    cards: PropTypes.object,
    geometry: PropTypes.object,
    service: PropTypes.object,
    loggedIn: PropTypes.bool,
    city: PropTypes.string,
    getCards: PropTypes.func.isRequired,
    getCityGeometry: PropTypes.func.isRequired,
    getServices: PropTypes.func.isRequired,
    appConfig: PropTypes.shape({
      frontendBaseUrl: PropTypes.string,
    }),
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = {
      shareButtonEl: null,
      sharePopupVisible: false,
    };
    this.handleOnShowSharePopup = this.handleOnShowSharePopup.bind(this);
    this.renderSharePopup = this.renderSharePopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getServices();
    this.props.getCityGeometry(this.props.city);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if ((!isEqual(this.props.service, nextProps.service) ||
         !isEqual(this.props.geometry, nextProps.geometry)) &&
         nextProps.service && nextProps.geometry) {
      this.props.getCards(nextProps.cards.sort, nextProps.geometry, [nextProps.service.id]);
    }
  }

  /**
   * Handle onFlip method.
   * @method handleOnShowSharePopup
   * @param {Object} shareButtonEl element
   * @returns {undefined}
   */
  handleOnShowSharePopup(shareButtonEl, { id, ctaLabel }) {
    if (shareButtonEl !== this.state.shareButtonEl) {
      this.setState({ sharePopupVisible: false }, () => {
        this.setState({
          sharePopupVisible: true,
          shareButtonEl,
          shareData: {
            id,
            ctaLabel,
          },
        });
      });
    } else {
      this.hidePopup();
    }
  }

  /**
   * Hide Popup.
   * @method hidePopup
   * @returns {undefined}
   */
  hidePopup() {
    this.setState({ sharePopupVisible: false, shareButtonEl: null, shareData: {} });
  }

  /**
   * SharePopup.
   * @method renderSharePopup
   * @returns {string} Markup for the component.
   */
  renderSharePopup() {
    const { frontendBaseUrl } = this.props.appConfig;

    return (
      <SharePopup
        frontendBaseUrl={frontendBaseUrl}
        buttons={[
          {
            icon: 'facebook',
          },
          {
            icon: 'twitter',
          },
          {
            icon: 'whatsapp',
          },
          {
            icon: 'mail',
          },
        ]}
        shareData={this.state.shareData}
        linkElement={this.state.shareButtonEl}
      />
    );
  }

  /**
   * renders.
   * @function renders
   * @returns {string} Markup of the container.
   */
  render() {
    const loginStatus = this.props.loggedIn;
    const loggedIn = !loginStatus;
    const { service, city, cards } = this.props;
    let title;
    if (service && service.name && city) {
      title = `${service.name} in ${city}`;
    }
    return (
      <div id="page-source">
        <Helmet title={title} />
        <Header />
        <Grid className={styles.wrapper}>
          <StaticHeader loggedIn={loggedIn}>
            <h1>
              {service && service.shortDescription}
              {' '} via {' '}
              <span className={styles.highlight}>
                {service && service.name}
              </span>
              {' '} in {' '}
              <span className={styles.highlight}>{city}</span>
            </h1>
          </StaticHeader>
          <Row className={styles.mainContent}>
            <Col sm={3} className={`hidden-xs ${styles.navigationWrapper}`}>
              <h2 className={styles.blockHeader}>
                {service && service.name}
              </h2>
              <div className={styles.blockContent}>
                {service && service.description}
              </div>
              { loggedIn ?
                null :
                <Button
                  url="/registreren"
                  className={`button ${styles.blockButton}`}
                  onClick={
                    () =>
                      piwik.push(['trackEvent', 'Onboarding', 'Click on register - Source - desktop cta'])
                    }
                >
                  Nu aanmelden
                </Button>
              }
            </Col>
            <Col sm={9} className={styles.gridHolder}>
              { (this.state.sharePopupVisible) ? this.renderSharePopup() : null }
              <MasonryGrid
                handleOnShowSharePopup={this.handleOnShowSharePopup}
                items={slice(cards.items, 0, 9)}
              />
            </Col>
            <Col sm={12} className={`visible-xs ${styles.navigationWrapper}`}>
              <h2 className={styles.blockHeader}>
                {service && service.name}
              </h2>
              <div className={styles.blockContent}>
                {service && service.description}
              </div>
              { loggedIn ?
                null :
                <Button
                  url="/registreren"
                  className={`button ${styles.blockButton}`}
                  onClick={
                    () =>
                      piwik.push(['trackEvent', 'Onboarding', 'Click on register - Source - mobile cta'])
                    }
                >
                  Nu aanmelden
                </Button>
              }
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    cards: state.cards,
    appConfig: state.appConfig,
    geometry: state.userSession.geometry,
    service: find(state.services.services, { name: props.params.name }),
    city: props.params.city,
    loggedIn: state.userSession.loggedIn,
  }), ({
    getCards,
    getCityGeometry,
    getServices,
  })
)(Source);
