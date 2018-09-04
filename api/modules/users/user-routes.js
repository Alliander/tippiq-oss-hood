/**
 * Express Router for user actions.
 * @module users/user-routes
 */

import { Router as expressRouter } from 'express';

import getProfile from './actions/get-profile';
import login from './actions/login';

const router = expressRouter();
export { router as default };

router
  .get('/profile', getProfile)
  .post('/login', login)
;
