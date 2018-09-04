/**
 * Routes.
 * @module routes
 */

import React from 'react';
import { get } from 'lodash';
import { IndexRoute, Route } from 'react-router';
import isMobile from 'ismobilejs';

import {
  About,
  App,
  BecomeAPartner,
  Newsletter,
  City,
  CheckEmail,
  Contact,
  Home,
  Logout,
  NotFound,
  Source,
  Stream,
  Styleguide,
  SocialCard,
  Theme,
  Partners,
  PlacePoliciesSuccess,
  PlacePoliciesFailed,
  PrivacyDisclaimer,
  Register,
  GoTo,
  HoodMessage,
} from './containers';
import { getUserToken, isUserTokenValid } from './helpers';
import { setQueryParams } from './utils/url';

/**
 * Check if user has auth token
 * @function requireAuth
 * @param {Object} nextState Next state
 * @param {function} replace Replace function
 * @param {Object} store Store
 * @returns {undefined}
 */
function requireAuth(nextState, replace, store) {
  const state = store.getState();
  let token = get(nextState, 'location.query.token');
  if (!token) {
    token = getUserToken();
  }
  if (__CLIENT__ && (!token || !isUserTokenValid(token))) {
    if (token) {
      replace({
        pathname: '/logout',
      });
    } else {
      const returnUrl = `${state.appConfig.frontendBaseUrl}/mijn-buurt`;
      const loginUrl = setQueryParams(`${state.appConfig.tippiqIdBaseUrl}/selecteer-je-huis`, {
        redirect_uri: returnUrl,
        clientId: state.appConfig.serviceId,
      });
      window.location.href = loginUrl;
    }
  }
}

/**
 * Check for prop on state
 * @function checkPropState
 * @param {Object} state Current State
 * @param {String} prop Property to check
 * @returns {boolean} Returns true if state has prop
 */
function checkPropState(state, prop) {
  switch (prop) {
    case 'placeId': {
      const hasPlaceId = !!(state.userSession[prop]);
      const token = getUserToken();
      return hasPlaceId && isUserTokenValid(token);
    }
    default:
      return false;
  }
}

/**
 * change page if needed
 * @function redirect
 * @param {Object} store Current State
 * @param {Object} options Options
 * @param {Object} nextState Next state
 * @param {function} replace Replace function
 * @returns {undefined}
 */
const redirect = (store, options) => (nextState, replace) => {
  const state = store.getState();
  const path = options.path || '/';
  const shouldRedirect = checkPropState(state, options.check);
  if (__CLIENT__ && shouldRedirect) {
    replace({
      pathname: path,
    });
  }
};


/**
 * Routes function.
 * @function
 * @param {Object} store Current State
 * @returns {Object} Routes.
 */
export default (store) => (
  <Route
    path="/"
    component={App}
    onChange={(prevState, nextState) => {
      if (isMobile.any && nextState.location.action === 'PUSH') {
        setTimeout(() => (window.scrollTo(0, 0)), 0);
      }
    }}
  >
    <IndexRoute
      component={Home}
      onEnter={redirect(store, { path: '/mijn-buurt', check: 'placeId' })}
    />
    <Route path="/over-tippiq" component={About} />
    <Route path="/logout" component={Logout} />
    <Route path="/partners" component={Partners} />
    <Route path="/partners/partner-worden" component={BecomeAPartner} />
    <Route path="/privacy" component={PrivacyDisclaimer} />
    <Route path="/contact" component={Contact} />
    <Route path="/bron/:name/:city" component={Source} />
    <Route path="/stad/:city" component={City} />
    <Route
      path="/mijn-buurt(/themas/:themes)(/diensten/:services)"
      component={Stream}
      onEnter={(nextState, replace) => requireAuth(nextState, replace, store)}
      onChange={(prevState, nextState, replace) => requireAuth(nextState, replace, store)}
    />
    <Route path="/styleguide" component={Styleguide} />
    <Route path="/card/:id" component={SocialCard} />
    <Route path="/email-bekijken" component={CheckEmail} />
    <Route path="/thema/:name/:city" component={Theme} />
    <Route path="/registreren" component={Register} />
    <Route path="/huisregel" component={PlacePoliciesSuccess} />
    <Route path="/huisregel-fout" component={PlacePoliciesFailed} />
    <Route path="/ga-naar/:cardId" component={GoTo} />
    <Route
      path="/buurtbericht-beheren"
      component={Newsletter}
    />
    <Route path="/buurtbericht/:status" component={HoodMessage} />
    <Route path="*" component={NotFound} status={404} />
  </Route>
);
