/**
 * Response handler for sending the first weekly notification.
 * @module newsletter/actions/send-first-newsletter
 */
import debugLogger from 'debug-logger';
import { UserPlace } from '../../places/models';
import { validatePermissionsAndSendUnauthorized } from '../../auth';
import permissions from '../../auth/permissions';
import { sendSingleNewsletter } from '../../weekly-notifications/actions/send-single-weekly-notification';
import { sendError } from '../../../common/route-utils';
import { WeeklyNotificationError } from '../../../common/errors';

const debug = debugLogger('tippiq-hood:newsletter:actions:send-first-newsletter');

/**
 * Response handler for send first newsletter.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const defaultDate = new Date();
  defaultDate.setTime(0);
  validatePermissionsAndSendUnauthorized(req, res, permissions.SEND_FIRST_WEEKLY_NOTIFICATION)
    .then(() => {
      if (req.user && req.user.id && req.params.placeId) {
        sendSingleNewsletter(req.user.id, req.params.placeId)
          .then(() =>
            res
              .status(204)
              .json({ success: true, message: 'Eerste wekelijkse buurtbericht verstuurd.' }))
          .catch(UserPlace.NotFoundError, () =>
            sendError(res, 404, 'Eerste wekelijkse buurtbericht al verstuurd of user en place niet gevonden.'))
          .catch(WeeklyNotificationError, e => {
            debug.trace(`Failed to send first weekly notification. Error: ${e}`);
            res
              .status(412)
              .json({
                success: false,
                message: 'Eerste wekelijkse buurtbericht versturen mislukt.',
              });
          })
          .catch(e => {
            debug.error(`Failed to send first weekly notification: ${e.message} ${e.stack}`);
            res
              .status(500)
              .json({
                success: false,
                message: 'Eerste wekelijkse buurtbericht versturen mislukt.',
              });
          });
      } else {
        res.status(403).json({ success: false, message: 'Geen toegang.' });
      }
    });
}
