/**
 * Response handler for update settings.
 * @module places/actions/update-settings
 */
import debugLogger from 'debug-logger';
import superagent from 'superagent';
import BPromise from 'bluebird';

import config from '../../../config';
import { UserPlace } from '../models';
import { UserPlaceRepository } from '../repositories';
import auth from '../../auth';
import permissions from '../../auth/permissions';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { UnauthorizedError } from '../../../common/errors';

const debug = debugLogger('tippiq-hood:places:actions:update-settings');

/**
 * Update location access token by exchanging OAuth2 authorization code
 * @function updateToken
 * @param {string} code OAuth2 authorization code
 * @param {object} model UserPlace model
 * @returns {object} Updated userPLace model
 */
function updateToken(code, model) {
  if (!code) {
    return BPromise.reject(
      new UnauthorizedError('Geen toegang.'));
  }
  const data = {
    grant_type: 'authorization_code',
    code,
    client_id: config.oAuth2ClientId,
  };
  return superagent
    .post(`${config.tippiqPlacesBaseUrl}/api/oauth2/token`)
    .auth(config.oAuth2ClientId, config.oAuth2ClientSecret)
    .send(data)
    .then(result => model.save({ placeAccessToken: result.body.access_token }));
}

/**
 * Get policies from places
 * @function getPolicies
 * @param {object} model UserPlace model
 * @param {string} code optional OAuth2 authorization code
 * @returns {object} Location
 */
export function getPolicies(model, code) {
  const userPlace = model.serialize({ context: 'user-place' });
  if (userPlace.placeAccessToken) {
    return superagent
      .get(`${config.tippiqPlacesBaseUrl}/api/places/${userPlace.placeId}/policies`)
      .set('Authorization', `Bearer ${userPlace.placeAccessToken}`)
      .send()
      .then(result => BPromise.resolve(result.body))
      .catch((err) => {
        if (err && err.status === 403) {
          // If PlaceAccessToken was denied, try to request a new one if we have a code
          if (code) {
            return updateToken(code, model)
              .then(getPolicies); // Get policies again with updated token
          }
          return BPromise.reject(new UnauthorizedError('Geen toegang.'));
        }
        return BPromise.reject(err);
      });
  }
  return BPromise.reject(new UnauthorizedError('Geen toegang.'));
}

/**
 * Update email notification enabled from policies
 * @function updateEmailNotificationEnabled
 * @param {object} userPlaceModel UserPlace model
 * @param {object} policies UserPlace policies
 * @returns {object} Location
 */
function updateEmailNotificationEnabled(userPlaceModel, policies) {
  const emailNotificationsEnabled = policies.filter(policy =>
    policy.templateSlug === config.newsletterPolicySlug).length > 0;
  return userPlaceModel.save({ emailNotificationsEnabled });
}

/**
 * Response handler for get location
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  let userPlace;
  auth
    .validatePermissionsAndSendUnauthorized(req, res, permissions.GET_PLACE_LOCATION)
    .then(() =>
      UserPlaceRepository.findOne({ place_id: req.params.id, user_id: req.user.get('id') }))
    .then(model => (model.get('placeAccessToken') ? model : updateToken(req.query.code, model)))
    .tap(model => (userPlace = model))
    .then(model => getPolicies(model, req.query.code))
    .then(policies => updateEmailNotificationEnabled(userPlace, policies))
    .then(() => res.json({ success: true }))
    .catch(UserPlace.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch(UnauthorizedError, () => {
      sendError(res, 403, 'Geen toegang.');
    })
    .catch(e => {
      debug.error(e.message);
      sendError(res, 500, 'Serverfout.');
    });
}
