/**
 * FlipCard component.
 * @module component/Card/FlipCard
 * Based on: https://github.com/mzabriskie/react-flipcard
 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { contains } from '../../helpers';

import styles from './FlipCard.css';

/**
 * FlipCard.
 * @class FlipCard
 * @extends Component
 */
export default class FlipCard extends Component {

  static propTypes = {
    type: PropTypes.string,
    flipped: PropTypes.bool,
    disabled: PropTypes.bool,
    onFlip: PropTypes.func,
    children(props, propName, componentName) {
      const prop = props[propName];

      if (React.Children.count(prop) !== 2) {
        throw new Error(`'${componentName}'` +
          'should contain exactly two children. ' +
          'The first child represents the front of the card. ' +
          'The second child represents the back of the card.'
        );
      }
    },
  };

  static defaultProps = {
    type: 'horizontal',
    flipped: false,
    disabled: false,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  state = {
    hasFocus: false,
    isFlipped: this.props.flipped,
  };

  /**
   * componentWillReceiveProps method.
   * @method componentWillReceiveProps
   * @param {Object} newProps New properties
   * @returns {undefined}
   */
  componentWillReceiveProps(newProps) {
    // Wait for display above to take effect
    setTimeout(() => {
      this.setState({
        isFlipped: newProps.flipped,
      });
    }, 0);
  }

  /**
   * componentWillUpdate method.
   * @method componentWillUpdate
   * @param {Object} nextProps Next properties
   * @param {Object} nextState Next state
   * @returns {undefined}
   */
  componentWillUpdate(nextProps, nextState) {
    // If card is flipping to back via props, track element for focus
    if (!this.props.flipped && nextProps.flipped) {
      this.focusElement = document.activeElement;
      this.focusBack = true;
    }

    // If isFlipped has changed need to notify
    if (this.state.isFlipped !== nextState.isFlipped) {
      this.notifyFlip = true;
    }
  }

  /**
   * componentDidUpdate method.
   * @method componentDidUpdate
   * @returns {undefined}
   */
  componentDidUpdate() {
    // If card has flipped to front, and focus is still within the card
    // return focus to the element that triggered flipping to the back.
    if (!this.props.flipped &&
      this.focusElement && contains(findDOMNode(this), document.activeElement)
    ) {
      this.focusElement.focus();
      this.focusElement = null;
    }
    // Direct focus to the back if needed
    /* eslint brace-style:0 */
    else if (this.focusBack) {
      this.back.focus();
      this.focusBack = false;
    }

    // Notify card being flipped
    if (this.notifyFlip && typeof this.props.onFlip === 'function') {
      this.props.onFlip(this.state.isFlipped);
      this.notifyFlip = false;
    }
  }

  /**
   * handleFocus method.
   * @method handleFocus
   * @returns {undefined}
   */
  handleFocus() {
    if (this.props.disabled) return;

    this.setState({
      isFlipped: true,
    });
  }

  /**
   * handleBlur method.
   * @method handleBlur
   * @returns {undefined}
   */
  handleBlur() {
    if (this.props.disabled) return;

    this.setState({
      isFlipped: false,
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div
        ref={(c) => { this.el = c; }}
        className={`${styles.flipCard} ${this.props.type} ` +
          `${styles[`flip-${this.props.type}`]} ` +
          `${this.state.isFlipped ? styles.flipped : ''} ` +
          `${this.props.disabled ? '' : styles.enabled}`
        }
        tabIndex={0}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <div className={styles.flipper}>
          <div
            className={styles.front}
            tabIndex={-1}
            aria-hidden={this.state.isFlipped}
          >
            {this.props.children[0]}
          </div>
          <div
            className={styles.back}
            ref={(c) => { this.back = c; }}
            tabIndex={-1}
            aria-hidden={!this.state.isFlipped}
          >
            {this.props.children[1]}
          </div>
        </div>
      </div>
    );
  }
}
