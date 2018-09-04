/**
 * Response handler for unsubscribe.
 * @module newsletter/actions/unsubscribe
 */
import debugLogger from 'debug-logger';
import { verifyTippiqHoodJWT, ACTIONS } from '../../auth';
import { UserPlaceRepository } from '../../places/repositories';
import { WeeklyNotificationError } from '../../../common/errors';

const debug = debugLogger('tippiq-hood:newsletter:actions:unsubscribe');

/**
 * Response handler for Unsubscribe.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  if (req.query.token && req.query.redirectUrl) {
    verifyTippiqHoodJWT(req.query.token, ACTIONS.UNSUBSCRIBE_WEEKLY_NOTIFICATION)
    .then(result => UserPlaceRepository.findOne({
      user_id: result.sub,
      place_id: result.placeId,
    }))
    .tap(userPlace => {
      if (userPlace.get('emailNotificationsEnabled') === false) {
        throw new WeeklyNotificationError('User already unsubscribed');
      }
    })
    .then(userPlace => userPlace.save({
      email_notifications_enabled: false,
    }))
    .then(() => res.redirect(`${req.query.redirectUrl}/success`))
    .catch(WeeklyNotificationError, () => res.redirect(`${req.query.redirectUrl}/failed`))
    .catch(err => {
      debug.trace(`Failed to Unsubscribe: ${err.message}`);
      res.redirect(`${req.query.redirectUrl}/failed`);
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: 'Ontbrekende waarde.' });
  }
}
