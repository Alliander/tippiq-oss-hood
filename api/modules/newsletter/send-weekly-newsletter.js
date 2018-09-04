import debugLogger from 'debug-logger';
import { chain, filter } from 'lodash';
import { knex } from '../../common/bookshelf';
import { UserPlaceRepository } from '../places/repositories';
import { sendEmailForUser } from '../weekly-notifications/actions/send-single-weekly-notification';
import { UnauthorizedError, WeeklyNotificationError } from '../../common/errors';

const debug = debugLogger('tippiq-hood:newsletter:send-weekly-newsletter');

/**
 * Queries the database and returns the current time in the transaction.
 * @function knexTimestamp
 * @return {Promise<string>} timestamp string
 */
export function knexTimestamp() {
  return knex.raw('SELECT now()').then(data => data.rows[0].now);
}

/**
 * Send a newsletter to a userPlace and convert the result into something that can be counted later
 * on. Failures are logged and converted too.
 * @function mapUserPlaceSendNewsletter
 * @param {string} highlightAreaContent HTML markup string with content for the high light area
 * @param {string} timestamp To update the userPlace with after successfully sending an email
 * @return {userPlaceSendNewsletter} Function to call for every userPlace.
 */
function mapUserPlaceSendNewsletter(highlightAreaContent, timestamp) {
  /**
   * Send a newsletter for a userplace.
   * @function userPlaceSendNewsletter
   * @param {object} userPlace To send a newsletter to
   * @return {Promise<object>} contains boolean success value and ids of userPlace
   */
  return function userPlaceSendNewsletter(userPlace) {
    const userId = userPlace.get('userId');
    const placeId = userPlace.get('placeId');
    return sendEmailForUser(userPlace, highlightAreaContent, timestamp)
      .tap(() => debug.debug('%j', { success: true, userId, placeId }))
      .then(() => ({ success: true, userId, placeId }))
      .tapCatch(err => {
        switch (err.name) {
          case UnauthorizedError.name:
          case WeeklyNotificationError.name:
            debug.warn('%j', { error: err.message, userId, placeId });
            break;
          default:
            debug.error('%j', { error: err.message, userId, placeId }, err);
        }
      })
      .catch(err => ({ success: false, error: err.message, userId, placeId }));
  };
}

/**
 * Send weekly newsletter.
 * @function sendWeeklyNewsletter
 * @param {string} highlightAreaContent HTML markup string with content for the high light area
 * @returns {undefined}
 */
export default function sendWeeklyNewsletter(highlightAreaContent) {
  return knexTimestamp()
    .then(timestamp => UserPlaceRepository
      .findAllNewsletterSubscribers()
      // convert from Bookshelf Collection to Array
      .then(userPlaces => userPlaces.toArray())
      // Bluebird .map feature
      .map(mapUserPlaceSendNewsletter(highlightAreaContent, timestamp), { concurrency: 1 })
      .tap(results => debug.trace('%j', { results }))
      // Extract statistics from the results:
      // - sent and failed are the record counts of success === true / false resp.
      // - failures contains a property for every error message found with a count
      .then(results => ({
        sent: filter(results, v => v.success).length,
        failed: filter(results, v => !v.success).length,
        failures: chain(results)
          .filter(v => v.error)
          .groupBy('error')
          .reduce((result, value, key) => ({ ...result, [key]: value.length }), {})
          .value(),
      }))
    );
}
