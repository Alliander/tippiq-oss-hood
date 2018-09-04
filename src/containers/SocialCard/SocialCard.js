/**
 * Stream container.
 * @module containers/Stream
 */

import React, { PropTypes, Component } from 'react';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isEmpty, has, last } from 'lodash';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import Helmet from 'react-helmet';

import {
  Button,
  Card,
  Footer,
  StaticHeader,
  SharePopup,
} from '../../components';

import {
  Header,
} from '../../containers';

import { getCard } from '../../actions';
import styles from './SocialCard.css';

import piwik from '../../piwik';

/**
 * Stream container.
 * @class Stream
 */
export class SocialCard extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    card: PropTypes.object,
    getCard: PropTypes.func.isRequired,
    params: PropTypes.object,
    loggedIn: PropTypes.bool,
    frontendBaseUrl: PropTypes.string,
  }

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static defaultProps = {
    card: {
      item: [],
    },
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
    this.props.getCard(this.props.params.id);
  }

 /**
   * Handle onFlip method.
   * @method handleOnShowSharePopup
   * @param {Object} shareButtonEl element
   * @returns {undefined}
   */
  handleOnShowSharePopup(shareButtonEl, { id, ctaLabel, title }) {
    if (shareButtonEl !== this.state.shareButtonEl) {
      this.setState({ sharePopupVisible: false }, () => {
        this.setState({
          sharePopupVisible: true,
          shareButtonEl,
          shareData: {
            id,
            ctaLabel,
            title,
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
   * renderProps.
   * @function renderProps
   * @returns {string} Markup of the container.
   */
  renderProps() {
    if (this.props.card.item[0]) {
      const card = this.props.card.item[0];
      const metaProps = [
        { property: 'og:title', content: card.title },
        { property: 'og:name', content: card.title },
        { property: 'twitter:card', content: card.title },
        { property: 'twitter:title', content: card.title },
        { property: 'og:description', content: card.description },
        { property: 'twitter:description', content: card.description },
        { property: 'twitter:creator', content: '@Tippiq' },
      ];

      if (!isEmpty(card.images)) {
        metaProps.push(
          { property: 'og:image', content: card.images.landscape },
          { property: 'twitter:image:src', content: card.images.landscape },
        );
      }

      return (
        <Helmet
          title={card.title}
          meta={metaProps}
        />
      );
    }
    return null;
  }

  /**
   * renderCard.
   * @method renderCard
   * @returns {undefined}
   */
  renderCard() {
    return this.props.card.item.map((card, key) => <Card
      blocks={card.document.blocks}
      content={card.description}
      title={card.title}
      ctaLabel={card.document.ctaLabel}
      ctaLink={card.document.ctaLink}
      distance={card.distance}
      serviceTitle={card.service.name}
      serviceUrl={card.service.url}
      serviceLogo={card.service.images.logo}
      serviceDescription={card.service.description}
      image={card.images.landscape}
      key={key}
      id={card.id}
      handleOnShowSharePopup={this.handleOnShowSharePopup}
    />);
  }


  /**
   * renders.
   * @function renders
   * @returns {string} Markup of the container.
   */
  render() {
    const { loggedIn } = this.props;
    return (
      <div>
        {this.renderProps()}
        { (this.state.sharePopupVisible) ? this.renderSharePopup() : null }
        <div id="page-socialcard">
          <Header />
          <Grid className={styles.wrapper}>
            <StaticHeader loggedIn={loggedIn}>
              <h1>
                Tippiq Buurt vond dit bericht:
              </h1>
            </StaticHeader>
            <Row className={styles.bodyBlock}>
              <Col sm={3}>
                <h2 className={styles.subHeader}>
                  Met Tippiq buurt ontvang je de buurtinformatie die jij wilt
                </h2>
                <p>
                  In het Buurtoverzicht en in je Buurtbericht vind je bijvoorbeeld
                  het laatste buurtnieuws en ben je altijd voorbereid op werkzaamheden,
                  kun je jouw buur een handje helpen of vertrouwd een auto huren voor weinig.
                  Meld je aan en ontdek jouw buurt!
                </p>
                { loggedIn ?
                  null :
                  <Button
                    url="/registreren"
                    className={styles.button}
                    onClick={
                      () =>
                        piwik.push(['trackEvent', 'Onboarding', 'Click on register - SocialCard'])
                      }
                  >
                      Nu aanmelden
                  </Button>
                }
              </Col>
              <Col sm={9}>
                {this.renderCard()}
              </Col>
            </Row>
          </Grid>
          <Footer />
        </div>
      </div>
    );
  }
}

/**
* getCurrentId.
* @function getCurrentId
* @param {state} state current State.
* @returns {string} Current Id.
*/
function getCurrentId(state) {
  if (state.routing && has(state.routing, 'locationBeforeTransitions')) {
    const params = state.routing.locationBeforeTransitions;
    const pathname = last(params.pathname.split('/'));
    if (pathname !== '' || pathname !== 'card' || pathname !== undefined) {
      return pathname;
    }
  }
  return false;
}

export default compose(
  asyncConnect(
    [
      {
        key: 'card',
        promise: ({ store: { dispatch, getState } }) =>
          dispatch(getCard(getCurrentId(getState()))),
      },
    ]
  ),
  connect(
    state => ({
      card: state.card,
      userSession: state.userSession,
      frontendBaseUrl: state.appConfig.frontendBaseUrl,
      loggedIn: state.userSession.loggedIn,
    }), ({
      getCard,
    })
  ),
)(SocialCard);
