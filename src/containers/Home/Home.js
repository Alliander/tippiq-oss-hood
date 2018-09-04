/**
 * Home container.
 * @module components/Home
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Footer, Button } from '../../components';
import { Header } from '../../containers';
import styles from './Home.css';
import tippiqHeadImage from '../../static/images/tippiq_buurt.png';
import tippiqImage from '../../static/images/tippiq_buurt_infoblock.svg';
import homeImage from '../../static/svgIcons/register.svg';
import { logout } from '../../actions';

import piwik from '../../piwik';

@connect(
  null,
  dispatch => bindActionCreators({ logout }, dispatch),
)

/**
 * Home component.
 * @function Home
 * @returns {string} Markup of the home page.
 */
export default class Home extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    logout: PropTypes.func.isRequired,
  }

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.logout();
  }

  /**
   * render
   * @function renders
   * @returns {string} Markup of the container.
   */
  render() {
    return (
      <div id="home-page" className={styles.homePage}>
        <Helmet title="Altijd weten wat er in jouw buurt gebeurt?" />
        <Header />
        <div className={styles.headImageContainer}>
          <img src={tippiqHeadImage} className={styles.headImage} alt="head" />
          <div className={styles.headImageContent}>
            <Grid className={styles.wrapper}>
              <Row className={`${styles.row} ${styles.mainContent}`}>
                <h1 className={styles.heading}>
                  Altijd weten wat er in jouw buurt gebeurt?
                </h1>
                <p>Dat kan met Tippiq Buurt! In het Buurtoverzicht vind je alle handige,
                  leuke en<br />actuele buurtinformatie op één plek.
                  Zo weet je altijd wat er speelt, gevraagd<br />
                  en aangeboden wordt rond jouw huis.
                  <br />
                  <br />
                  Meld je aan en bekijk wat jouw buurt te bieden heeft!
                  <br />
                  <Button
                    url="/registreren"
                    className={styles.button}
                    onClick={
                      () =>
                        piwik.push(['trackEvent', 'Onboarding', 'Click on register - Home - upper cta'])
                    }
                  >
                    Aanmelden voor het Buurtbericht
                  </Button>
                </p>
              </Row>
            </Grid>
          </div>
        </div>
        <Grid className={styles.wrapper}>
          <Row className={`${styles.row} ${styles.mainContent}`}>
            <h1 className={styles.heading}>
              Bekijk online of in het Buurtbericht
            </h1>
          </Row>
          <div className={styles.homeImageWrapper}>
            <img
              src={homeImage}
              className={styles.homeImage}
              alt="home"
            />
          </div>
          <Row className={`${styles.row} ${styles.homeBlock}`}>
            <Col sm={5} className={styles.first}>
              <Row className={styles.top}>
                <p className={styles.paragraph}>
                  De buurtinformatie van Tippiq kun je op twee manieren<br />
                  bekijken. Online, in jouw persoonlijke Buurtoverzicht,
                  afgestemd op jouw interesses en voorkeuren. Of via het
                  Buurtbericht, een wekelijkse nieuwsbrief die de belangrijkste
                  informatie uit je Buurtoverzicht toont.
                  <br />
                  <br />
                  Natuurlijk hoef je niet te kiezen, want met het Buurtoverzicht en het
                  Buurtbericht weet je zeker dat je niets mist!
                </p>
              </Row>
            </Col>
            <Col sm={5} className={`hidden-xs ${styles.second} ${styles.top}`}>
              <img src={tippiqImage} alt="static" className={styles.image} />
            </Col>
          </Row>
        </Grid>
        <div className={`container-fluid ${styles.firstMidSection}`}>
          <Grid className={`${styles.wrapper} ${styles.midSectionWrapper}`}>
            <Row className={styles.row}>
              <h1 className={styles.heading}>
                Wat kun je vinden op Tippiq
                <span className={styles.baseColor}> Buurt</span>?
              </h1>
            </Row>
            <Row className={styles.row}>
              <Col sm={5} className={styles.split}>
                <ul className={styles.detailedList}>
                  <li>
                    <h4>Evenementen</h4>
                    <span>
                      Feestjes, braderieën, workshops en markten
                    </span>
                  </li>
                  <li>
                    <h4>Duurzaamheid</h4>
                    <span>
                      Initiatieven die duurzaamheid bevorderen
                    </span>
                  </li>
                  <li>
                    <h4>Sociaal</h4>
                    <span>
                      Helpen of hulp gevraagd
                    </span>
                  </li>
                  <li>
                    <h4>Aanbiedingen winkels</h4>
                    <span>
                      Aanbiedingen van winkels uit jouw buurt
                    </span>
                  </li>
                </ul>
              </Col>
              <Col sm={5} className={styles.split}>
                <ul className={styles.detailedList}>
                  <li>
                    <h4>Lenen en delen</h4>
                    <span>
                      (On)betaalde aangeboden/gevraagde zaken
                    </span>
                  </li>
                  <li>
                    <h4>Vermissing en calamiteiten</h4>
                    <span>
                      Vermiste mensen en dieren
                    </span>
                  </li>
                  <li>
                    <h4>Waarschuwingen en meldingen</h4>
                    <span>
                      Weerswaarschuwingen, werkzaamheden en (ver)storingen
                    </span>
                  </li>
                  <li>
                    <h4>Nieuws</h4>
                    <span>
                      Het laatste nieuws uit jouw buurt
                    </span>
                  </li>
                </ul>
              </Col>
            </Row>
          </Grid>
        </div>
        <div className={`container-fluid ${styles.secondMidSection}`}>
          <Grid className={`${styles.wrapper} ${styles.midSectionWrapper}`}>
            <Row className={styles.row}>
              <Col sm={5} className={styles.split}>
                <h2 className={`${styles.subHeading} ${styles.midSubHeading}`}>
                  De voordelen van Tippiq <span className={styles.baseColor}> &nbsp;Buurt
                  </span>
                </h2>
                <ul className={styles.specialList}>
                  <li>Alle buurtinformatie op één plek</li>
                  <li>
                    Wekelijks het Buurtbericht met de belangrijkste <br />
                    informatie rond je huis
                  </li>
                  <li>Personaliseer je Buurtoverzicht</li>
                  <li>Regelmatig nieuwe informatiebronnen</li>
                </ul>
              </Col>
              <Col sm={5} className={styles.split}>
                <h2 className={`${styles.subHeading} ${styles.midSubHeading}`}>
                  Meld je aan
                </h2>
                <p>
                  Op de hoogte blijven van wat er rond jouw huis en in jouw
                  buurt speelt doe je met Tippiq Buurt. In het Buurtoverzicht en
                  in je Buurtbericht vind je het laatste buurtnieuws en daarom ben je
                  altijd voorbereid op werkzaamheden, kun je jouw buur een
                  handje helpen of vertrouwd een auto huren voor weinig.
                  <br />
                  <Button
                    url="/registreren"
                    className={styles.button}
                    onClick={
                      () =>
                        piwik.push(['trackEvent', 'Onboarding', 'Click on register - Home - lower cta'])
                    }
                  >
                    Aanmelden voor het Buurtbericht
                  </Button>
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
