/**
 * SharePopup component.
 * @module component/SharePopup
 */
import React, { Component, PropTypes } from 'react';
import isMobile from 'ismobilejs';

import styles from './SharePopup.css';
import { Share } from '../../helpers';

const share = new Share();

const setPopupPosition = (elem, link, context) => {
  const bodyRect = document.body.getBoundingClientRect();
  const btnRect = link.getBoundingClientRect();
  const popupRect = elem.getBoundingClientRect();
  const btnOffsetTop = btnRect.top - bodyRect.top;
  const btnOffsetLeft = btnRect.left - bodyRect.left;

  const y = (Math.abs(bodyRect.top) > btnRect.top) ?
    `${Math.abs(bodyRect.top) + btnRect.top + 40}px` : `${(btnOffsetTop - elem.offsetHeight - 20)}px`; // eslint-disable-line no-mixed-operators
  // eslint-disable-next-line max-len
  let x = (btnOffsetLeft + (link.offsetWidth / 2) - (elem.offsetWidth / 2)); // eslint-disable-line no-mixed-operators
  if ((x + popupRect.width) > bodyRect.width) {
    x = bodyRect.width - popupRect.width - 15;
  }
  x = `${Math.round(x)}px`;

  if (Math.abs(bodyRect.top) > btnRect.top) {
    context.setState({ flip: 'flipTop' });
  } else {
    context.setState({ flip: 'flipBottom' });
  }

  return {
    top: y,
    left: x,
    margin: 0,
    opacity: 1,
  };
};

const createStyle = (elem, link, context) => setPopupPosition(elem, link, context);

/**
 * SharePopup container.
 * @function Styleguide
 * @returns {string} Markup of the sharePopup.
 */
export default class SharePopup extends Component {
  static propTypes = {
    buttons: PropTypes.array.isRequired,
    popupElement: PropTypes.any,
    linkElement: PropTypes.any,
    shareData: PropTypes.object,
    frontendBaseUrl: PropTypes.string,
  };

  static defaultProps = {
    blocks: [],
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = {
      sharePopupStyle: {},
      flip: 'flipBottom',
      sharePopupEl: {},
    };
    this.handlePosition = this.setPopup.bind(this);
  }

  /**
   * componentDidMount method.
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.setPopup();
    window.addEventListener('resize', this.handlePosition);
    window.addEventListener('scroll', this.handlePosition);
  }

  /**
   * componentWillUnmount method.
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handlePosition);
    window.removeEventListener('scroll', this.handlePosition);
  }

  /**
   * setPopup method.
   * @method setPopup
   * @returns {undefined}
   */
  setPopup() {
    const elem = this.sharePopupEl || this.props.popupElement;
    const SharePopupStyle = createStyle(elem, this.props.linkElement, this);
    this.setState({ SharePopupStyle });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { buttons, shareData } = this.props;
    const { frontendBaseUrl } = this.props;

    return (
      <div
        className={`${styles.sharePopup} ${styles[this.state.flip]}`}
        ref={(c) => { this.sharePopupEl = c; }}
        style={this.state.SharePopupStyle}
      >
        <h4>Delen via:</h4>
        <div className={styles.shareButtonHolder}>
          {
            buttons.map((button, key) => {
              if (button.icon === 'whatsapp' && __CLIENT__ && isMobile.any === false) {
                return null;
              }
              return (
                <div className={styles.shareButtonWrapper}>
                  { (button.icon) ?
                    <button
                      key={key}
                      onClick={() => share.social({ platform: button.icon, ...shareData },
                        frontendBaseUrl)}
                      className={`${styles.shareIconWrapper} ${styles[button.icon]}`}
                    />
                    : null
                  }
                  <span className={styles.shareText}>{button.icon}</span>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
