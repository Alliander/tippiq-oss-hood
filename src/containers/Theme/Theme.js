/**
 * Theme container.
 * @module containers/Theme
 */

import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { filter, isEqual, slice } from 'lodash';

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
import styles from './Theme.css';

import piwik from '../../piwik';

const descriptions = {
  Duurzaamheid: 'Ben je op zoek naar acties en ideeën die de duurzaamheid bevorderen? Dan vind je hiernaast een helder overzicht. Hier vind je allerlei initiatieven die te maken hebben met het verduurzamen van jouw buurt of stad. Soms gaat dat over het aanleggen van groenvoorzieningen, maar het kan ook gaan over het gezamenlijk besparen op plasticafval. Je vindt hier zelfs dagen waarop er bijvoorbeeld opgeroepen wordt om samen vuil te gaan prikken. Zo helpt Tippiq jouw wijk, buurt en/of stad schoon en duurzaam te houden.',
  Evenementen: 'Weten welke evenementen er plaatsvinden? Dan zit je hier goed. Hier vind je een overzicht van feestjes, maar net zo goed braderieën, culturele evenementen en markten. Verzin het en je vindt het onder dit thema. Wel zo leuk want nu kun je een dagje of zelfs heel weekend plannen. Ook kun je er rekening mee houden dat het op bepaalde plekken wellicht wat drukker kan zijn en hierop je verdere plan op afstemmen.',
  Sociaal: 'Het thema sociaal laat alles zien rondom je huis wat te maken heeft met sociaal doen. Dat gaat vooral om het helpen van anderen. Zo kun je buren helpen met het leren van nieuwe skills en bijvoorbeeld het helpen van uitvoeren van klusjes. Zo ben je niet alleen heel sociaal bezig maar maak je de buurt ook sterker en op een sterke buurt kun je bouwen. Ook word je daar zelf wijzer van en kun je eenvoudig je burennetwerk vergroten en andere mensen rond je huis zelf ook eens om hulp vragen.',
  'Lenen en delen': 'In het thema lenen en delen vind je allerhande informatie rondom jouw huis waarbij je het aanbod te zien krijgt van wat er in jouw directe omgeving te leen aangeboden wordt. Uiteraard kun je via de aangesloten bronnen zelf ook iets te delen aanbieden. Dit kan gaan om ruimte die je bij een buurtbewoner kunt huren tot en met auto’s, boten en caravans die in jouw directe omgeving te huur en te leen zijn. Tevens vind je hier een uitgebreid aanbod van allerhande praktische zaken die je kunt lenen, van partytenten tot en met schroevendraaiers. Uiteraard worden hier ook veel zaken te leen gevraagd in de directe omgeving van je huis. Dus help je buren!',
  'Vermissingen en Calamiteiten': 'In dit thema vind je de meer urgente zaken. Zo zie je hier welke vermissingen en alarmeringen er rond jouw huis of woonplaats zijn. Tippiq verzamelt deze om zo het bereik te maximaliseren en op deze manier bij te dragen aan een goede afloop. Vermissingen kunnen mensen en dieren betreffen en we vragen zo extra aandacht opdat jij jouw steentje kunt bijdragen. Calamiteiten kunnen divers zijn, maar mocht er iets plaatsvinden rond jouw huis zorgen wij dat je op de hoogte bent.',
  'Waarschuwingen en meldingen': 'Hier vind je alle meldingen en waarschuwingen rond jouw huis terug. Het is wel zo handig om te weten wanneer en of er wegwerkzaamheden rond jouw woning plaats (gaan) vinden. Ook vind je hier de status en uitgifte van vergunningen en andere (stroom)storingen. En als er een weeralarm wordt uitgegeven rond jouw huis of in jouw buurt dan krijg je daar ook melding van opdat je op tijd veilig naar binnen kunt.',
};

/**
 * Theme container.
 * @class Theme
 */
export class Theme extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    cards: PropTypes.object,
    geometry: PropTypes.object,
    services: PropTypes.array,
    loggedIn: PropTypes.bool,
    category: PropTypes.string,
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
    if ((!isEqual(this.props.services, nextProps.services) ||
         !isEqual(this.props.geometry, nextProps.geometry)) &&
         nextProps.services && nextProps.geometry) {
      this.props.getCards(nextProps.cards.sort, nextProps.geometry, nextProps.services);
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
      <div id="page-theme">
        <Helmet title={`${this.props.category} via Tippiq in ${this.props.city}`} />
        <Header />
        <Grid className={styles.wrapper}>
          <StaticHeader loggedIn={loggedIn}>
            <h1>
              {this.props.category}
              {' '} via Tippiq in {' '}
              <span className={styles.highlight}>{this.props.city}</span>
            </h1>
          </StaticHeader>
          <Row className={styles.mainContent}>
            <Col sm={3} className={`hidden-xs ${styles.navigationWrapper}`}>
              <h2 className={styles.blockHeader}>{this.props.category}</h2>
              <div className={styles.blockContent}>
                {descriptions[this.props.category]}
              </div>
              { loggedIn ?
                null :
                <Button
                  url="/registreren"
                  className={`button ${styles.blockButton}`}
                  onClick={
                    () =>
                      piwik.push(['trackEvent', 'Onboarding', 'Click on register - Theme - desktop cta'])
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
              <h2 className={styles.blockHeader}>{this.props.category}</h2>
              <div className={styles.blockContent}>
                {descriptions[this.props.category]}
              </div>
              { loggedIn ?
                null :
                <Button
                  url="/registreren"
                  className={`button ${styles.blockButton}`}
                  onClick={
                    () =>
                      piwik.push(['trackEvent', 'Onboarding', 'Click on register - Theme - mobile cta'])
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
    services: filter(state.services.services, service => service.category === props.params.name)
      .map(service => service.id),
    category: props.params.name,
    city: props.params.city,
    loggedIn: state.userSession.loggedIn,
  }), ({
    getCards,
    getCityGeometry,
    getServices,
  })
)(Theme);
