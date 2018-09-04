/**
 * Register container.
 * @module containers/Register
 */

import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { extend } from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import { connect } from 'react-redux';
import { Grid, Row, Col, Modal } from 'react-bootstrap';
import { Footer, Field, Button } from '../../components';
import { Header, AddressSuggestion } from '../../containers';
import { validate, urlHelper, Address } from '../../helpers';
import styles from './Register.css';
import tippiqImage from '../../static/images/tippiqstatic1.png';
import registerImage from '../../static/svgIcons/register.svg';
import { setQueryParams } from '../../utils/url';

import piwik from '../../piwik';

/**
 * Register container.
 * @class Register
 */
export class Register extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    loggedIn: PropTypes.bool,
    config: PropTypes.any,
    addressSuggestion: PropTypes.any,
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
      selected: false,
      showModal: false,
      suggestionError: null,
    };
    this.submit = this.submit.bind(this);
    this.submitAlreadyRegistered = this.submitAlreadyRegistered.bind(this);
    this.selectMessage = this.selectMessage.bind(this);
    this.renderSubscribe = this.renderSubscribe.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.send = this.send.bind(this);
  }

  /**
   * Select subscribe
   * @method selectMessage
   * @returns {undefined}
   */
  selectMessage() {
    this.setState({
      selected: !this.state.selected,
    });
  }

  /**
   * closeModal
   * @method closeModal
   * @returns {undefined}
   */
  closeModal() {
    this.setState({ showModal: false });
  }

  /**
   * openModal
   * @method openModal
   * @returns {undefined}
   */
  openModal() {
    this.setState({ showModal: true });
  }

  /**
   * submit
   * @method submit
   * @returns {undefined}
   */
  submit() {
    if (validate({ email: this.email }) && this.props.addressSuggestion.selected) {
      this.setState({
        emailError: false,
        suggestionError: false,
      }, () => {
        if (this.state.selected === true) {
          this.send();
        } else {
          this.openModal();
        }
      });
    } else {
      this.setState({
        emailError: !validate({ email: this.email }),
        suggestionError: !this.props.addressSuggestion.selected,
      });
    }
  }

  /**
   * send
   * @method send
   * @returns {undefined}
   */
  send() {
    const { config } = this.props;
    const address = this.props.addressSuggestion.selected;
    const trackingCode = uuidV4();
    const redirectPage = this.state.selected ? `email-bekijken?track=${trackingCode}` : `mijn-buurt?track=${trackingCode}`;
    const nextStep = this.state.selected ? 'step 2' : 'step 3';
    const dataObj = {
      clientId: config.serviceId,
      placeAddress: {
        attributeType: config.locationAttributeType,
        ...address,
      },
      placeAddressForEmail: Address.fromJson(address).toShortString(),
      policies: [extend({}, config.locationPolicy, {
        serviceProviderId: config.serviceId,
        templateSlug: config.locationPolicySlug,
      })],
      email: this.email.getValue(),
      trackingCode,
      redirect_uri: `${window.location.origin}/${redirectPage}`,
    };
    if (this.state.selected === true) {
      dataObj.policies.push(extend({}, config.newsletterPolicy, {
        serviceProviderId: config.serviceId,
        templateSlug: config.newsletterPolicySlug,
      }));
    }
    this.closeModal();
    const url = `${this.props.config.tippiqIdBaseUrl}/snelle-registratie/?`;
    piwik.push(['trackEvent', 'Register flow', `Submit register form (step 1) - go to ${nextStep} - track: ${trackingCode}`]);
    window.location.href = urlHelper.objectToUrl(dataObj, url);
  }

  /**
   * submitAlreadyRegistered
   * @method submitAlreadyRegistered
   * @returns {undefined}
   */
  submitAlreadyRegistered() {
    const { frontendBaseUrl, tippiqIdBaseUrl, serviceId } = this.props.config;
    window.location.href = setQueryParams(`${tippiqIdBaseUrl}/selecteer-je-huis`, {
      redirect_uri: `${frontendBaseUrl}/mijn-buurt`,
      clientId: serviceId,
    });
  }

  /**
   * renderModal
   * @function renderModal
   * @returns {string} Markup of the container.
   */
  renderModal() {
    return (
      <Modal
        show={this.state.showModal}
        onHide={this.closeModal}
      >
        <Modal.Body className={styles.popupBody}>
          <div>
            <h2 className={styles.subHeader}>
              Weet je zeker dat je geen Buurtbericht wilt ontvangen?
            </h2>
            {this.renderSubscribe('popup')}
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.popupFooter}>
          <Button
            onClick={this.send}
            responsive
          >
            Aanmelden
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  /**
   * renderSubscribe.
   * @function renderSubscribe
   * @param {String} id id.
   * @returns {string} Markup of the container.
   */
  renderSubscribe(id) {
    return (
      <div className={styles.subscribe}>
        <Field
          field={{ name: id, selected: this.state.selected }}
          type="checkbox"
          selected={this.state.selected}
          action={this.selectMessage}
        />
        <span
          className={styles.subscribeText}
        >
          {id === 'popup' ? 'Nee, ik wil me alsnog inschrijven voor het Buurtbericht.' : 'Ja, Tippiq Buurt mag mij een bericht sturen met informatie rondom mijn huis.'}
        </span>
      </div>
    );
  }

  /**
   * render
   * @function renders
   * @returns {string} Markup of the container.
   */
  render() {
    return (
      <div id="register-page" className={styles.registerPage}>
        <Helmet title="Registreren" />
        <Header />
        {this.renderModal()}
        <Grid className={styles.wrapper}>
          <Row className={`${styles.row} ${styles.mainContent}`}>
            <div className={styles.registerImageWrapper}>
              <img
                src={registerImage}
                className={styles.registerImage}
                alt="register"
              />
            </div>
            <h1 className={styles.heading}>Aanmelden Buurtbericht</h1>
            <p>Maak dan een Tippiq Huis aan en krijg online toegang tot
             je buurt via je Buurtbericht.
            </p>
          </Row>
          <Row className={`${styles.row} ${styles.registerBlock}`}>
            <Col sm={5} className={styles.first}>
              <Row className={`${styles.contentWrapper} ${styles.top}`}>
                <h2 className={styles.subHeading}>
                  Maak je Tippiq Huis aan
                </h2>
                <div className={styles.suggest}>
                  <AddressSuggestion
                    error={this.state.suggestionError}
                    required
                    autoFocus
                  />
                  <span className={styles.smallText}>
                    Zodat we de juiste buurtinformatie voor je kunnen verzamelen
                  </span>
                </div>
                <div className={styles.suggest}>
                  <Field
                    field={{ name: 'email' }}
                    type="email"
                    placeholder="Jouw emailadres"
                    ref={(input) => { this.email = input; }}
                    required
                  />
                  <span className={styles.smallText}>
                    Zodat we je het Buurtbericht kunnen sturen
                  </span>
                </div>
                <Button
                  onClick={this.submitAlreadyRegistered}
                  buttonType="link"
                  className={styles.button}
                >
                  Ik heb al een Tippiq Huis
                </Button>
              </Row>

              <Row className={`${styles.contentWrapper} ${styles.bottom}`}>
                <h2 className={styles.subHeading}>Huisregel</h2>
                {this.renderSubscribe('content')}
              </Row>

              <Row className={`${styles.row} ${styles.bottom} ${styles.buttonWrapper}`}>
                <Button
                  onClick={this.submit}
                  responsive
                >
                  Aanmelden
                </Button>
              </Row>
            </Col>
            <Col sm={5} className={`hidden-xs ${styles.second} ${styles.top}`}>
              <img src={tippiqImage} alt="static" className={styles.image} />
            </Col>
          </Row>
        </Grid>
        <div className={`container-fluid ${styles.midSection}`}>
          <Grid className={`${styles.wrapper} ${styles.midSectionWrapper}`}>
            <Row className={styles.row}>
              <h2 className={`${styles.subHeading} ${styles.midSubHeading}`}>
                Het Buurtbericht: alles wat je moet weten over jouw buurt in één overzicht,
                elke week in je mail!
              </h2>
            </Row>
            <Row className={styles.row}>
              <Col sm={5} className={styles.split}>
                <p className={`${styles.midContent} ${styles.midfirst}`}>
                  Bij Tippiq Buurt geloven we dat jouw buurt voor een groot deel
                   bepaalt hoe je leeft.
                  <br />
                  Daarom verzamelen we de meest interessante informatie rond
                  jouw huis. Van wegwerkzaamheden en evenementen in de buurt tot buren
                  die hulp vragen en jou een stuk gereedschap kunnen lenen.<br />
                  Diverse bronnen leveren ons hun lokale informatie aan die wij vervolgens in
                  het zogenaamde Buurtoverzicht laten zien.
                </p>
              </Col>
              <Col sm={5} className={styles.split}>
                <p className={`${styles.midContent} ${styles.midsecond}`}>
                  Het Buurtoverzicht wordt samengesteld op basis van jouw adres en de
                  informatie die op dat moment daar beschikbaar is.<br />
                  Soms gaat dit om het lenen van een auto vlakbij huis tot het vinden van een
                  oppas voor je huisdier in de buurt. <br />
                  Om het je nog makkelijker te maken hebben we het Buurtbericht in het leven
                  geroepen. <br />
                  Op Tippiq Buurt kun je eenvoudig
                  je voorkeuren aanpassen, thema’s aan- en uitzetten en zelfs op bronniveau
                  selecties maken. <br />
                </p>
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    loggedIn: state.userSession.loggedIn,
    addressSuggestion: state.addressSuggestion,
    config: state.appConfig,
  }), ({})
)(Register);
