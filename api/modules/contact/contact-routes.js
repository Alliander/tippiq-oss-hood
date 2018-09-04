/**
 * Express Router for contact actions.
 * @module contact/contact-routes
 */

import { Router as expressRouter } from 'express';

import sendForm from './actions/send-form';


const router = expressRouter();
export { router as default };

router
  .post('/', sendForm)
;
