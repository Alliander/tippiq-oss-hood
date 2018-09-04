/**
 * Response handler for set email notification.
 * @module users/actions/set-email-notification.
 */
import debugLogger from 'debug-logger';
import { UserPlaceRepository } from '../repositories';
import { SET_EMAIL_NOTIFICATION } from '../../auth/permissions';
import { validatePermissionsAndSendUnauthorized } from '../../auth';
import { ValidationError } from '../../../common/errors';

const debug = debugLogger('tippiq-hood:places:actions:set-email-notification');

/**
 * Validate input.
 * @function validateInput
 * @param {boolean} value Value to check.
 * @returns {undefined}
 */
function validateInput(value) {
  if (typeof value !== 'boolean') {
    throw new ValidationError();
  }
}
/**
 * Response handler for set email notification.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissionsAndSendUnauthorized(req, res, SET_EMAIL_NOTIFICATION)
    .tap(() => validateInput(req.body.enabled))
  // TODO: Action should be moved to User. Place_id should be retrieved from jwt in strategy
    .then(() =>
      UserPlaceRepository.findOne({ place_id: req.params.id, user_id: req.user.get('id') }))
    .then(userPlaceModel =>
      userPlaceModel.save({ email_notifications_enabled: req.body.enabled === true }))
    .then(userPlaceModel => {
      res
        .status(200)
        .send({
          success: true,
          email_notifications_enabled: userPlaceModel.get('email_notifications_enabled'),
        });
    })
    .catch(ValidationError, () => {
      res
        .status(400)
        .json({ success: false, message: 'E-mail notificatie instellen mislukt, ongeldige waarde.' });
    })
    .catch(err => {
      debug.trace(err.message);
      res
        .status(500)
        .json({ success: false, message: 'E-mail notificatie instellen mislukt.' });
    });
}
