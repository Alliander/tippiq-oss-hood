/**
 * Express Router for config actions.
 * @module modules/config/config-routes
 */

import { Router as expressRouter } from 'express';

import { getConfig } from './actions';

const router = expressRouter();

export { router as default };

router.route('/')
  .get(getConfig);
