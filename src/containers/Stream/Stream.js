/**
 * Stream container.
 * @module containers/Stream
 */

import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import {
  ButtonGroup,
  Col,
  Grid,
  Row,
} from 'react-bootstrap';
import { get } from 'lodash';

import { Footer, MasonryGrid, SharePopup } from '../../components';
import {
  DesktopSort,
  Header,
  MobileFilter,
  MobileSort,
  ServiceFilter,
  ThemeFilter,
} from '../../containers';

import {
  getCards,
  getPlaceLocation,
  sendFirstWeeklyNotification,
  initServiceFilter,
  toggleThemeFilter,
  toggleServiceFilter,
} from '../../actions';
import piwik from '../../piwik';

import styles from './Stream.css';

/**
 * Stream container.
 * @class Stream
 */
export class Stream extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    cards: PropTypes.object,
    placeLocation: PropTypes.object,
    userSession: PropTypes.object,
    frontendBaseUrl: PropTypes.string,
    location: PropTypes.object,
    themes: PropTypes.string,
    enabledThemes: PropTypes.array,
    services: PropTypes.string,
    enabledServices: PropTypes.array,
    allServices: PropTypes.array,
    filteredServices: PropTypes.array,
    getPlaceLocation: PropTypes.func.isRequired,
    getCards: PropTypes.func.isRequired,
    sendFirstWeeklyNotification: PropTypes.func.isRequired,
    initServiceFilter: PropTypes.func.isRequired,
    toggleThemeFilter: PropTypes.func.isRequired,
    toggleServiceFilter: PropTypes.func.isRequired,
    router: PropTypes.object,
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
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.initLocation();
    const emailIsVerified = get(this.props, 'location.query.emailIsVerified');
    if (emailIsVerified) {
      this.props.sendFirstWeeklyNotification(this.props.userSession.placeId);
    }
    const track = get(this.props, 'location.query.track');
    if (track) {
      piwik.push(['trackEvent', 'Register flow', `Land on stream (step 3) - track: ${track}`]);
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { userSession, placeLocation, allServices } = nextProps;
    if (userSession.loggedIn && placeLocation.idle) {
      this.props.getPlaceLocation(userSession.placeId);
    } else if (!this.filtersInitialized && placeLocation.location && allServices.length > 0) {
      // init active filters from route after location & all services are loaded
      this.initFilters(nextProps);
    }
    if (this.filtersInitialized) {
      this.updateRoute(nextProps);
    }
  }

  /**
   * Init filters
   * @method initFilters
   * @param {Object} props properties
   * @returns {undefined}
   */
  initFilters(props) {
    const { themes, services, cards, placeLocation } = props;
    const startThemes = themes ? themes.split(',') : [];
    const startServices = services ? services.split(',') : [];
    if (startThemes.length > 0 || startServices.length > 0) {
      props.initServiceFilter(startThemes, startServices);
    } else {
      props.getCards(cards.sort, placeLocation.location.geometry);
    }
    this.filtersInitialized = true;
  }

  /**
   * Update route with active filters
   * @param {Object} props properties
   * @method updateRoute
   * @returns {undefined}
   */
  updateRoute(props) {
    const { enabledThemes, enabledServices, filteredServices, router } = props;
    const myServices = filteredServices.length === enabledServices.length ? [] : enabledServices;

    const pathname = `/mijn-buurt${enabledThemes.length > 0 ? `/themas/${enabledThemes.join(',')}`
      : ''}${myServices.length > 0 ? `/diensten/${myServices.join(',')}` : ''}`;
    if (pathname !== decodeURI(router.getCurrentLocation().pathname)) {
      router.replace({ pathname });
    }
  }

  /**
   * Init location
   * @method initLocation
   * @returns {undefined}
   */
  initLocation() {
    const { userSession, cards, placeLocation } = this.props;
    if (placeLocation.location && placeLocation.location.geometry) {
      this.props.getCards(cards.sort, placeLocation.location.geometry);
    } else if (userSession.placePolicyUrl) {
      window.location.href = userSession.placePolicyUrl;
    } else if (userSession.placeId) {
      this.props.getPlaceLocation(userSession.placeId);
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
    const { frontendBaseUrl } = this.props;

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
   * Render cards view.
   * @function renderCardsView
   * @returns {string} Markup of the container.
   */
  renderCardsView() {
    const { cards, placeLocation } = this.props;
    let cardsView;

    if (placeLocation.placePolicyUrl) {
      cardsView = (
        <div className={styles.warning}>
          We hebben geen toegang tot je locatie en kunnen daardoor geen kaartjes tonen.<br />
          <a href={placeLocation.placePolicyUrl}>Klik hier om je Huisregels te beheren</a>
        </div>
      );
    } else {
      cardsView = !cards.pending && !cards.idle && cards.items.length === 0 ?
        <div className={styles.warning}>
          Er zijn geen kaartjes gevonden in jouw buurt met de geselecteerde zoekcritera.
        </div>
        :
        <MasonryGrid
          handleOnShowSharePopup={this.handleOnShowSharePopup}
          items={cards.items}
        />;
    }

    return (
      <Col sm={9} className={styles.gridHolder}>
        {this.state.sharePopupVisible && this.renderSharePopup()}
        {!placeLocation.error ? cardsView :
          <div className={styles.warning}>
            We hebben geen toegang tot je locatie en kunnen daardoor geen kaartjes tonen.
          </div>
        }
      </Col>
    );
  }

  /**
   * renders.
   * @function renders
   * @returns {string} Markup of the container.
   */
  render() {
    return (
      <div id="page-stream">
        <Helmet title="Dit gebeurt er in je buurt" />
        <Header />
        <Grid className={styles.wrapper}>
          <Row>
            <Col sm={12}>
              <div className="visible-xs">
                <ButtonGroup>
                  <MobileFilter />
                  <MobileSort />
                </ButtonGroup>
              </div>
              <div className={`pull-right hidden-xs ${styles.alignWithBottom}`}>
                <DesktopSort />
              </div>
              <h1 className={styles.title}>Dit gebeurt er in je buurt</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={3} className={`hidden-xs ${styles.navigationWrapper}`}>
              <ThemeFilter />
              <ServiceFilter />
            </Col>
            {this.renderCardsView()}
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    placeLocation: state.placeLocation,
    cards: state.cards,
    frontendBaseUrl: state.appConfig.frontendBaseUrl,
    userSession: state.userSession,
    themes: props.params.themes,
    services: props.params.services,
    enabledThemes: state.services.enabledThemes,
    enabledServices: state.services.enabledServices,
    allServices: state.services.services,
    filteredServices: state.services.filteredServices,
  }),
  ({
    getCards,
    getPlaceLocation,
    sendFirstWeeklyNotification,
    initServiceFilter,
    toggleThemeFilter,
    toggleServiceFilter,
  })
)(Stream);
