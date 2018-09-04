/**
 * Express Router for newsletter actions.
 * @module newsletter/newsletter-routes
 */

import { Router as expressRouter } from 'express';

import sendWeeklyNewsletter, { authenticationMiddleware } from './actions/send-weekly-newsletter';
import sendFirstNewsletter from './actions/send-first-newsletter';
import sendPreviewNewsletter from './actions/send-preview-newsletter';
import unsubscribeWeeklyNewsletter from './actions/unsubscribe-weekly-newsletter';

const router = expressRouter();
export { router as default };

router
  .get('/', authenticationMiddleware(), sendWeeklyNewsletter)
  .get('/placeId/:placeId/send-first-newsletter', sendFirstNewsletter)
  .get('/placeId/:placeId/userId/:userId/preview-newsletter', sendPreviewNewsletter)
  .get('/unsubscribe', unsubscribeWeeklyNewsletter)
;
