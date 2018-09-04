/**
 * Header container.
 * @module containers/Header
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { getPlaceLocation } from '../../actions';
import { NavBar } from '../../components';
import { Address } from '../../helpers';
import { setQueryParams } from '../../utils/url';
/**
 * Header container.
 * @class Header
 */
class Header extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    userSession: PropTypes.shape({
      placeId: PropTypes.string,
      location: PropTypes.object,
      loggedIn: PropTypes.bool,
    }),
    tippiqIdBaseUrl: PropTypes.string,
    frontendBaseUrl: PropTypes.string,
    serviceId: PropTypes.string,
    getPlaceLocation: PropTypes.func.isRequired,
    hideMenu: PropTypes.bool,
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.userSession.loggedIn && !nextProps.userSession.location) {
      this.props.getPlaceLocation(nextProps.userSession.placeId);
    }
  }

  /**
   * render.
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    const { tippiqIdBaseUrl, frontendBaseUrl, serviceId, userSession, hideMenu } = this.props;
    const { location, loggedIn } = userSession;

    const returnUrl = `${frontendBaseUrl}/mijn-buurt`;
    const loginUrl = setQueryParams(`${tippiqIdBaseUrl}/selecteer-je-huis`, {
      redirect_uri: returnUrl,
      clientId: serviceId,
    });
    const myAccountUrl = `${tippiqIdBaseUrl}/mijn-account/naam`;
    const title = Address.fromJson(location) ?
      Address.fromJson(location).toShortString() : 'Onbekend adres';

    return (
      <NavBar
        placeTitle={title}
        loginUrl={loginUrl}
        selectPlaceUrl={loginUrl}
        myAccountUrl={myAccountUrl}
        loggedIn={loggedIn}
        hideMenu={hideMenu}
      />
    );
  }
}

export default connect(
  state => ({
    tippiqIdBaseUrl: state.appConfig.tippiqIdBaseUrl,
    frontendBaseUrl: state.appConfig.frontendBaseUrl,
    serviceId: state.appConfig.serviceId,
    userSession: state.userSession,
  }), ({
    getPlaceLocation,
  })
)(Header);
