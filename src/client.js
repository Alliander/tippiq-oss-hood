import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import jwtDecode from 'jwt-decode';

import { configureStore } from './store';
import getRoutes from './routes';
import { Api, getUserToken, persistUserToken, isUserTokenValid } from './helpers';

const api = new Api();
const initialState = window.__data;  // eslint-disable-line no-underscore-dangle

const token = getUserToken();
if (!initialState.userSession.token && token && isUserTokenValid(token)) {
  const placeId = jwtDecode(token).placeId;
  initialState.userSession = { token, placeId, loggedIn: !!placeId };
}

const store = configureStore(initialState, undefined, false, api);
const history = syncHistoryWithStore(browserHistory, store);
persistUserToken(store);

render(
  <Provider
    store={store}
    key="provider"
  >
    <Router
      render={(props) =>
        <ReduxAsyncConnect
          helpers={{ api }}
          {...props}
        />}
      history={history}
    >
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('content')
);

if (module.hot) {
  module.hot.accept();
}
