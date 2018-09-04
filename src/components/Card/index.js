/**
 * Card component.
 * @module component/Card
 */

import React, { Component, PropTypes } from 'react';
import { truncate } from 'lodash';
import FlipCard from './FlipCard';
import CardInfo from './CardInfo';
import styles from './Card.css';
import { getDistance } from '../../helpers';

import piwik from '../../piwik';

/**
 * Card.
 * @class Card
 * @extends Component
 */
export default class Card extends Component {

  static propTypes = {
    blocks: PropTypes.array,
    content: PropTypes.string,
    ctaLabel: PropTypes.string,
    ctaLink: PropTypes.string,
    title: PropTypes.string,
    distance: PropTypes.number,
    image: PropTypes.string,
    serviceTitle: PropTypes.string,
    serviceDescription: PropTypes.string,
    serviceLogo: PropTypes.string,
    serviceUrl: PropTypes.string,
    category: PropTypes.string,
    id: PropTypes.string,
    handleOnShowSharePopup: PropTypes.func,
  };

  static defaultProps = {
    blocks: [],
  };

  /**
   * Track
   * @method track
   * @param {String} serviceTitle Service title
   * @param {String} category Category
   * @param {String} title Title
   * @returns {undefined}
   */
  track(serviceTitle, category, title) {
    piwik.push(['trackEvent', 'Stream Card', `Click on stream card - service: ${serviceTitle}`]);
    piwik.push(['trackEvent', 'Stream Card', `Click on stream card - theme: ${category}`]);
    piwik.push(['trackEvent', 'Stream Card', `Click on stream card - title: ${title}`]);
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.showBack = this.showBack.bind(this);
    this.showFront = this.showFront.bind(this);
    this.handleOnFlip = this.handleOnFlip.bind(this);
    this.state = {
      isFlipped: false,
      cardHeight: 350,
    };
  }

  /**
   * Flip to back of card
   * @method showBack
   * @returns {undefined}
   */
  showBack() {
    const cardHeight = document.getElementById(`ident-${this.props.id}`).clientHeight;
    this.setState({
      cardHeight,
      isFlipped: true,
    });
  }

  /**
   * Flip to front of card
   * @method showFront
   * @returns {undefined}
   */
  showFront() {
    this.setState({
      isFlipped: false,
    });
  }

  /**
  * Handle onFlip method.
  * @method handleOnFlip
  * @param {boolean} flipped Flipped
  * @returns {undefined}
  */
  handleOnFlip(flipped) {
    if (flipped) {
      this.backButton.focus();
    }
  }

  /**
   * Render front side of card method.
   * @method renderFront
   * @returns {string} Markup for the component.
   */
  renderFront() {
    const {
      blocks,
      content,
      title,
      ctaLink,
      ctaLabel,
      distance,
      image,
      serviceLogo,
      serviceTitle,
      category,
    } = this.props;

    return (<div className={styles.plane}>
      <div className={styles.imageWrapper} style={{ backgroundImage: `url(${image})` }}>
        <div className={styles.distance}>{ getDistance(distance) }</div>
        <a
          className={styles.imageLink}
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          title={ctaLabel}
          onClick={() => this.track(serviceTitle, category, title)}
        >
          &nbsp;
        </a>
        <button
          className={styles.shareButton}
          onClick={() => this.props.handleOnShowSharePopup(this.shareButtonEl, { ...this.props })}
          ref={(c) => { this.shareButtonEl = c; }}
        />
      </div>
      <div className={styles.frontContainer}>
        <div className={styles.titleContainer}>
          <h4 className={styles.title}>
            <a href={ctaLink} target="_blank" rel="noopener noreferrer" title={ctaLabel}>
              {title}</a>
          </h4>
        </div>
        <div className={`${styles.content} font-main`}>
          { truncate(content, { length: 300, separator: '' }) }
        </div>
        {
          (blocks.length > 0) ? <div className={styles.blocks}>
            {
              blocks.map((block, blockkey) => {
                if (blockkey <= 2) {
                  return (
                    <div className={styles.block} key={blockkey}>
                      <span className={styles.blockItem}>{block.label}</span>
                      <span className={`${styles.blockItem} ${styles.textColor}`}>
                        {block.value}
                      </span>
                    </div>
                  );
                }
                return null;
              })
            }
          </div> : null
        }
        <a
          className={styles.contentLink}
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          title={ctaLabel}
          onClick={() => this.track(serviceTitle, category, title)}
        >
          &nbsp;
        </a>
      </div>
      <CardInfo title={serviceTitle} logo={serviceLogo} position="bottom">
        <button className={styles.buttonIcon} onClick={this.showBack} >
          <i className={styles.infoIcon} />
        </button>
      </CardInfo>
    </div>);
  }

  /**
   * Render back side of card method.
   * @method renderFront
   * @returns {string} Markup for the component.
   */
  renderBack() {
    const {
      serviceLogo,
      serviceTitle,
      serviceDescription,
      ctaLink,
      ctaLabel,
      title,
      category,
    } = this.props;
    const contentStyle = (ctaLink) ? { maxHeight: `calc(${this.state.cardHeight}px - 136px)` } :
    { maxHeight: `calc(${this.state.cardHeight}px - 72px)` };

    return (
      <div className={styles.plane} style={{ minHeight: this.state.cardHeight }}>
        <CardInfo title={serviceTitle} logo={serviceLogo}>
          <button
            className={styles.buttonIcon}
            ref={(c) => { this.backButton = c; }}
            onClick={this.showFront}
          >
            <i className={styles.closeIcon} />
          </button>
        </CardInfo>
        <div className={`${ctaLink ? styles.backContainer : styles.backContainerLarge}`} style={contentStyle}>
          {serviceDescription}
        </div>
        { ctaLink ?
          <div className={styles.backBottom}>
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={() => this.track(serviceTitle, category, title)}
            >
              {ctaLabel}
            </a>
          </div>
          : null }
      </div>
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div className={`${styles.container}`} id={`ident-${this.props.id}`}>
        <FlipCard
          disabled
          flipped={this.state.isFlipped}
          onFlip={this.handleOnFlip}
          onKeyDown={this.handleKeyDown}
        >
          {this.renderFront()}
          {this.renderBack()}
        </FlipCard>
      </div>
    );
  }
}
