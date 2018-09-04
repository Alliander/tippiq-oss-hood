/**
 * Response handler for set email notification.
 * @module users/actions/set-email-notification.
 */
import debugLogger from 'debug-logger';
import { UserPlaceRepository } from '../repositories';
import { SET_EMAIL_NOTIFICATION } from '../../auth/permissions';
import { validatePermissionsAndSendUnauthorized } from '../../auth';

const debug = debugLogger('tippiq-hood:places:actions:get-email-notification-status');

/**
 * Response handler for set email notification.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissionsAndSendUnauthorized(req, res, SET_EMAIL_NOTIFICATION)
    .then(() =>
      UserPlaceRepository.findOne({ place_id: req.params.placeId, user_id: req.user.get('id') }))
    .then(userPlaceModel => {
      res
        .status(200)
        .send({
          success: true,
          email_notifications_enabled: userPlaceModel.get('emailNotificationsEnabled'),
        });
    })
    .catch(err => {
      debug.error(err.message);
      res
        .status(500)
        .json({ success: false, message: 'E-mail notificatiestatus verkrijgen mislukt.' });
    });
}
