/**
 * City container.
 * @module containers/City
 */

import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { slice, isEqual } from 'lodash';

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

import { getCards, getCityGeometry } from '../../actions';
import styles from './City.css';

import piwik from '../../piwik';

/**
 * City container.
 * @class City
 */
export class City extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    cards: PropTypes.object,
    geometry: PropTypes.object,
    loggedIn: PropTypes.bool,
    city: PropTypes.string,
    getCards: PropTypes.func.isRequired,
    getCityGeometry: PropTypes.func.isRequired,
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
    this.props.getCityGeometry(this.props.city);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.geometry, nextProps.geometry)) {
      this.props.getCards(nextProps.cards.sort, nextProps.geometry);
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
    const { loggedIn } = this.props;
    return (
      <div id="page-city">
        <Helmet title={`Dit gebeurt er in ${this.props.city}`} />
        <Header />
        <Grid className={styles.wrapper}>
          <StaticHeader loggedIn={loggedIn}>
            <h1 className={styles.title}>
              Dit gebeurt er in <span className={styles.highlight}>{this.props.city}</span>
            </h1>
          </StaticHeader>
          <Row className={styles.mainContent}>
            <Col sm={3} className={`hidden-xs ${styles.navigationWrapper}`}>
              <h2 className={styles.blockHeader}>Alles wat er gebeurt in {this.props.city}</h2>
              <div className={styles.blockContent}>
                Hiernaast vind je alles wat er gebeurt in de omgeving van {this.props.city}.
                Van evenementen tot en met initiatieven en gebeurtenissen met een meer
                sociaal karakter als welke auto’s er in {this.props.city} te huur zijn.
                Datzelfde geldt trouwens voor gereedschap en wegwerkzaamheden. Zo breed
                gaat het echt.
                Je vindt hier alle informatie uit {this.props.city} die je
                helpen jouw leven te vergemakkelijken en of te verbeteren.
              </div>
              <div className={styles.blockContent}>
                Zo vind je
                ook buurtinitiatieven in {this.props.city} die op hyperlokaal niveau laten
                zien wat er speelt. Vul je jouw adres in dan wordt het nog accurater en
                kun je heel nauwkeurig volgen wat er rond jouw huis in {this.props.city} speelt.
              </div>
              <div className={styles.blockContent}>
                Wanneer je een account aanmaakt krijg je meer opties en kun je
                dit overzicht niet alleen personaliseren maar kun je tevens je voorkeuren
                opslaan. Als je wilt kun je dan tevens het Buurtbericht toegezonden
                krijgen waarbij je wekelijks de meest relevantie buurtinformatie gewoon
                in je mail krijgt. Wel zo makkelijk.
              </div>
              { loggedIn ?
                null :
                <Button
                  url="/registreren"
                  className={`button ${styles.blockButton}`}
                  onClick={
                    () =>
                      piwik.push(['trackEvent', 'Onboarding', 'Click on register - City - desktop cta'])
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
                items={slice(this.props.cards.items, 0, 9)}
              />
            </Col>
            <Col sm={3} className={`visible-xs ${styles.navigationWrapper}`}>
              <h2 className={styles.blockHeader}>Alles wat er gebeurt in {this.props.city}</h2>
              <div className={styles.blockContent}>
                Hiernaast vind je alles wat er gebeurt in de omgeving van {this.props.city}.
                Van evenementen tot en met initiatieven en gebeurtenissen met een meer
                sociaal karakter als welke auto’s er in {this.props.city} te huur zijn.
                Datzelfde geldt trouwens voor gereedschap en wegwerkzaamheden. Zo breed
                gaat het echt. Je vindt hier alle informatie uit {this.props.city} die je
                helpen jouw leven te vergemakkelijken en of te verbeteren.
              </div>
              <div className={styles.blockContent}>
                Zo vind je
                ook buurtinitiatieven in {this.props.city} die op hyperlokaal niveau laten
                zien wat er speelt. Vul je jouw adres in dan wordt het nog accurater en
                kun je heel nauwkeurig volgen wat er rond jouw huis in {this.props.city} speelt.
              </div>
              <div className={styles.blockContent}>
                Wanneer je een account aanmaakt krijg je meer opties en kun je
                dit overzicht niet alleen personaliseren maar kun je tevens je voorkeuren
                opslaan. Als je wilt kun je dan tevens het Buurtbericht toegezonden
                krijgen waarbij je wekelijks de meest relevantie buurtinformatie gewoon
                in je mail krijgt. Wel zo makkelijk.
              </div>
              { loggedIn ?
                null :
                <Button
                  url="/registreren"
                  className={`button ${styles.blockButton}`}
                  onClick={
                    () =>
                      piwik.push(['trackEvent', 'Onboarding', 'Click on register - City - mobile cta'])
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
    city: props.params.city,
    loggedIn: state.userSession.loggedIn,
  }), ({
    getCards,
    getCityGeometry,
  })
)(City);
