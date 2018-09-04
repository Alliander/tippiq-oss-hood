// server
// import path from 'path';
import express from 'express';
import expressHealthcheck from 'express-healthcheck';
import debugLogger from 'debug-logger';
import httpProxy from 'http-proxy';
import frameguard from 'frameguard';

// SSR
import React from 'react';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';

import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, createMemoryHistory, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { Html, Api } from './helpers';
import ErrorPage from './error';
import getRoutes from './routes';
import { configureStore } from './store';
import config from './config';

const debug = debugLogger('tippiq-hood:server');

export default (parameters) => {
  const app = express();
  const staticPath = __dirname;

  app.use(frameguard({ action: 'deny' }));

  // Serve static files
  app.use(express.static(__dirname));
  app.use('/assets', express.static(__dirname));

  app.use('/healthcheck', expressHealthcheck());

  // Proxy API calls to API server
  const proxy = httpProxy.createProxyServer({ target: `http://${config.apiHost}:${config.apiPort}/api` });
  app.use('/api', (req, res) => proxy.web(req, res));

  // React application rendering
  app.use((req, res) => {
    const api = new Api(req);
    const memoryHistory = createMemoryHistory(req.path);
    const store = configureStore({}, memoryHistory, false, api);
    const history = syncHistoryWithStore(memoryHistory, store);

    match({
      history,
      routes: getRoutes(store),
      location: req.originalUrl,
    }, (err, redirectInfo, routeState) => { // eslint-disable-line complexity
      if (redirectInfo && redirectInfo.redirectInfo) {
        res.redirect(redirectInfo.path);
      } else if (err) {
        res.error(err.message);
      } else if (routeState) {
        const statusCode = !routeState.params.splat ? 200 : 404;
        if (__SSR__) {
          loadOnServer({ ...routeState, store })
            .then(() => {
              const component = <Provider store={store}><ReduxAsyncConnect {...routeState} /></Provider>; // eslint-disable-line max-len
              res.set({ 'Cache-Control': 'public, max-age=600, no-transform' });
              res.status(statusCode).send(`<!doctype html> ${renderToStaticMarkup(<Html assets={parameters.chunks()} component={component} store={store} staticPath={staticPath} />)}`);
            })
            .catch(error => {
              const errorPage = <ErrorPage message={error.message} />;
              res.set({ 'Cache-Control': 'public, max-age=60, no-transform' });
              res.status(500).send(`<!doctype html> ${renderToStaticMarkup(errorPage)}`);
            });
        } else {
          const component = <Provider store={store}><RouterContext {...routeState} /></Provider>;
          res.set({ 'Cache-Control': 'public, max-age=60, no-transform' });
          res.status(statusCode).send(`<!doctype html> ${renderToStaticMarkup(<Html assets={parameters.chunks()} component={component} store={store} staticPath={staticPath} />)}`);
        }
      } else {
        res.set({ 'Cache-Control': 'public, max-age=3600, no-transform' });
        res.sendStatus(404);
      }
    });
  });

  // Start the HTTP server
  app.listen(config.port, (err) => {
    if (err) {
      debug.error(err);
    } else {
      debug.info('==> 🚧  Webpack development server listening on port %s', config.port);
    }
  });
};

