/**
 * App container.
 * @module containers/App/App
 */
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { getAppConfig, login } from '../../actions';
import { CookieWall } from '../../containers';
import constants from '../../constants/app';

/**
 * Application container class.
 * @class Application
 * @extends Component
 */
export class App extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object,
    router: PropTypes.object,
  };

  /**
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() { // eslint-disable-line complexity
    const { location, router } = this.props;
    if (location && router) {
      const query = location.query;
      if (query.token || query.accessToken || query.track || query.emailIsVerified) {
        delete query.token;
        delete query.accessToken;
        delete query.track;
        delete query.emailIsVerified;
        router.replace({ pathname: location.pathname, query });
      }
    }
  }

  /**
   * Render
   * @function render
   * @returns {string} JSX the rendered elements
   */
  render() {
    const { children } = this.props;
    return (
      <div>
        <Helmet {...constants.head} />
        <CookieWall />
        {children}
      </div>
    );
  }
}

export default asyncConnect([{
  key: 'appConfig',
  promise: ({ store: { dispatch } }) => dispatch(getAppConfig()),
}, {
  key: 'userSession',
  promise: ({ store: { dispatch }, location: { query } }) => {
    if (query.token) {
      return dispatch(login(query.token, query.accessToken));
    }
    return Promise.resolve();
  },
}])(App);
