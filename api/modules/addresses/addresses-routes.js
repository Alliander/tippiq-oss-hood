/**
 * Express Router for addresses actions.
 * @module modules/addresses/addresses-routes
 */

import { Router as expressRouter } from 'express';

import { lookup, search } from './actions';

const router = expressRouter();

export { router as default };

router
  .get('/lookup', lookup)
  .get('/search', search);
