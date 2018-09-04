/**
 * Express Router for place actions.
 * @module users/place-routes
 */

import { Router as expressRouter } from 'express';

import getLocation from './actions/get-location';
import updateSettings from './actions/update-settings';
import setEmailNotification from './actions/set-email-notification';
import getEmailNotificationStatus from './actions/get-email-notification-status';

const router = expressRouter();
export { router as default };

router
  .get('/:id/location', getLocation)
  .get('/:id/settings', updateSettings)
  .get('/:placeId/email-notification-status', getEmailNotificationStatus)
  .post('/:id/email-notification', setEmailNotification)
;
