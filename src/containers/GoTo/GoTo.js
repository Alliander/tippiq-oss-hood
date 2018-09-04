/**
 * GoTo container.
 * @module containers/GoTo/GoTo
 */
import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import styles from './GoTo.css';
import logo from '../../static/images/buurt.svg';
import { getCard } from '../../actions';

import piwik from '../../piwik';

const redirectTime = 2000;

/**
 * GoTo container.
 * @class GoTo
 */
export class GoTo extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    params: PropTypes.object,
    card: PropTypes.object,
    getCard: PropTypes.func.isRequired,
  }

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { cardId } = this.props.params;
    if (cardId) {
      this.props.getCard(cardId);
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (!nextProps.card.success) return;
    if (!isEqual(this.props.card, nextProps.card)) {
      const { title, id, document, service } = nextProps.card.item[0];
      piwik.push(['trackEvent', 'Newsletter', `Click on newsletter card - service: ${service.name}`]);
      piwik.push(['trackEvent', 'Newsletter', `Click on newsletter card - theme: ${service.category}`]);
      piwik.push(['trackEvent', 'Newsletter', `Click on newsletter card - cardId: ${id} - title: ${title}`]);
      window.setTimeout(() => {
        window.location.href = document && document.ctaLink ? document.ctaLink
          : service.url;
      }, redirectTime);
    }
  }

  /**
   * Render markup
   * @method render
   * @returns {string} Markup of the container.
   */
  render() {
    if (!this.props.card.success) {
      return null;
    }
    const { document, service } = this.props.card.item[0];
    return (
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <div className={styles.body}>
            {
              (this.props.card.success && service.name) ? (
                <div>
                  <Helmet
                    title={`Een ogenblik geduld. Je wordt doorgestuurd naar ${service.name}`}
                  />
                  <p className={styles.textLarge}>
                    Een ogenblik geduld.
                    Je wordt doorgestuurd naar <strong>{service.name}</strong>
                  </p>
                  <p className={styles.textSmall}>
                    Duurt dit langer dan 2 seconden?<br />
                    Klik dan
                    <a
                      href={document && document.ctaLink ? document.ctaLink : service.url}
                    > hier </a> om direct door te gaan
                  </p>
                </div>)
                :
                <div>
                  <Helmet title="Er is iets fout gegaan." />
                  <p className={styles.textLarge}>
                    Er is iets fout gegaan.
                  </p>
                </div>
            }
          </div>
          <div className={styles.footer}>
            <img className={styles.logoImage} src={logo} alt="tippiq" />
          </div>
        </div>
      </div>);
  }
}

export default connect(
  state => ({
    card: state.card,
  }), ({
    getCard,
  })
)(GoTo);
