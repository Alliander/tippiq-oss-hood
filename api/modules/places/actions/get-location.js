/**
 * Response handler for get location.
 * @module places/actions/get-location
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
import { createPlacePolicyUrl } from '../../places';

const debug = debugLogger('tippiq-hood:places:actions:get-location');

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
 * Get location attribute from places
 * @function getLocation
 * @param {object} model UserPlace model
 * @returns {object} Location
 */
export function getLocation(model) {
  const userPlace = model.serialize({ context: 'user-place' });
  const oneDayAgo = new Date().setDate(new Date().getDate() - 1);

  return BPromise.try(() => {
    if (userPlace.placeAccessToken) {
      if (userPlace.location && userPlace.locationUpdatedAt &&
        userPlace.locationUpdatedAt > oneDayAgo) {
        return userPlace.location;
      }
      return BPromise
        .resolve(superagent
          .get(`${config.tippiqPlacesBaseUrl}/api/places/${userPlace.placeId}/attributes?type=${config.locationAttributeType}`)
            .set('Authorization', `Bearer ${userPlace.placeAccessToken}`)
            .send()
        )
        .then(result => {
          if (result.body.length && result.body[0].data) {
            const location = result.body[0].data;
            delete location.attributeType;
            return model.save({
              location,
              locationUpdatedAt: new Date().toISOString(),
            }).then(() => location);
          }
          // We don't want users without location, so reject
          // This will add a placePolicyUrl to the response so user can re-request access
          throw new UnauthorizedError('Empty location not allowed!');
        })
        .catch(err => { throw new UnauthorizedError(err); });
    }
    throw new UnauthorizedError('Geen toegang.');
  });
}

/**
 * Create login url for users that don't exist in hood db
 * @function createLoginUrl
 * @returns {string} Login Url
 */
function createLoginUrl() {
  return `${config.tippiqIdBaseUrl}/selecteer-je-huis?clientId=${config.oAuth2ClientId}&redirect_uri=${encodeURIComponent(`${config.frontendBaseUrl}/mijn-buurt`)}`;
}

/**
 * Response handler for get location
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const placeId = req.params.id;
  auth
    .validatePermissions(req, res, permissions.GET_PLACE_LOCATION)
    .then(() => UserPlaceRepository.findOne({ place_id: placeId, user_id: req.user.get('id') }))
    .then(model => (model.get('placeAccessToken') ? model : updateToken(req.query.code, model)))
    .then(model => getLocation(model))
    .then(location => res.json({ location }))
    .catch(UserPlace.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch(UnauthorizedError, () => {
      res
        .status(200)
        .send({
          location: {},
          // If no req user, then user is unknown, and need to be sent to loginUrl
          placePolicyUrl: req.user ? createPlacePolicyUrl(placeId) : createLoginUrl(),
        });
    })
    .catch(e => {
      debug.error(e.message);
      sendError(res, 500, `Serverfout: ${e.message}.`);
    });
}
