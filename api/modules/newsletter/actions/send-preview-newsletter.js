/**
 * Response handler for sending the preview weekly notification.
 * @module newsletter/actions/send-preview-newsletter
 */
import debugLogger from 'debug-logger';
import { UserPlace } from '../../places/models';
import { sendSingleNewsletter } from '../../weekly-notifications/actions/send-single-weekly-notification';
import { sendError } from '../../../common/route-utils';
import { WeeklyNotificationError } from '../../../common/errors';

const debug = debugLogger('tippiq-hood:newsletter:actions:send-first-newsletter');
const basicAuth = 'previewer:bekijk het maar!';
/**
 * Response handler for send preview newsletter.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const auth = req.headers.authorization;
  if (auth && new Buffer(auth.replace('Basic ', ''), 'base64').toString() === basicAuth
    && req.params.userId && req.params.placeId) {
    sendSingleNewsletter(req.params.userId, req.params.placeId, false)
      .then(() =>
        res
          .status(204)
          .json({ success: true, message: 'Wekelijkse preview verstuurd.' }))
      .catch(UserPlace.NotFoundError, () =>
        sendError(res, 404, 'Wekelijkse preview al verstuurd of user en place niet gevonden.'))
      .catch(WeeklyNotificationError, e => {
        debug.trace(`Failed to send preview weekly notification. Error: ${e}`);
        res
          .status(412)
          .json({
            success: false,
            message: 'Wekelijkse preview versturen mislukt.',
          });
      })
      .catch(e => {
        debug.error(`Failed to send preview weekly notification: ${e.message} ${e.stack}`);
        res
          .status(500)
          .json({
            success: false,
            message: 'Wekelijkse preview versturen mislukt.',
          });
      });
  } else {
    res.status(403).json({ success: false, message: 'Geen toegang.' });
  }
}
