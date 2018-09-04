/**
 * Express Router for service actions.
 * @module service/service-routes
 */

import { Router as expressRouter } from 'express';

import getServices from './actions/get-all-services';

const router = expressRouter();
export { router as default };

router
  .get('/', getServices)
;
