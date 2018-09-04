/**
 * CookieWall container.
 * @module containers/CookieWall
 */

import React, { Component } from 'react';
import cookie from 'react-cookie';

import { CookieWall as CookieWallComponent } from '../../components';

/**
 * CookieWall class.
 * @class CookieWall
 * @extends Component
 */
export class CookieWall extends Component {

  /**
   * Constructor
   * @method constructor
   * @param {object} props The props to process
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = {
      cookieWallVisible: true,
    };
    this.shouldShowCookieWall = this.shouldShowCookieWall.bind(this);
    this.setCookie = this.setCookie.bind(this);
  }

  /**
   * SetCookie
   * @function setCookie
   * @returns {undefined} Returns nothing
   */
  setCookie() {
    if (__CLIENT__) {
      this.setState({
        cookieWallVisible: false,
      }, () => {
        const date = new Date();
        const domain = window.location.hostname === 'localhost' ? window.location.hostname :
          `${window.location.hostname.substring(
            window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1)
            .split(':')[0]}`;
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // one year
        cookie.save('viewed_cookie_policy', 'yes',
          {
            expires: date,
            domain,
          });
      });
    }
  }

  /**
   * ShouldShowCookieWall
   * @function shouldShowCookieWall
   * @returns {bool} true or false bool
   */
  shouldShowCookieWall() {
    if (__CLIENT__) {
      return typeof (cookie.load('viewed_cookie_policy')) === 'undefined';
    }
    return false;
  }

  /**
   * Render
   * @function render
   * @returns {JSX} the rendered elements
   */
  render() {
    return (this.shouldShowCookieWall() && this.state.cookieWallVisible &&
      <CookieWallComponent action={this.setCookie} />
    );
  }
}

export default CookieWall;
