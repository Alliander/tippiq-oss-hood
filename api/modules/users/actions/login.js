/**
 * Response handler for login.
 * @module users/actions/login
 */
import debugLogger from 'debug-logger';
import { verifyLoginJWT, validatePermissionsAndSendUnauthorized } from '../../auth';
import { UserRepository } from '../repositories';
import { UserPlaceRepository } from '../../places/repositories';
import { getLocation } from '../../places/actions/get-location';
import { LOGIN_USER } from '../../auth/permissions';
import { UnauthorizedError } from '../../../common/errors';
import { createPlacePolicyUrl } from '../../places';

const debug = debugLogger('tippiq-hood:users:actions:login');

/**
 * Find or create user and place from session token
 * @function getUserPlace
 * @param {Object} userId Tippiq-id userId
 * @param {Object} placeId Place Id
 * @param {string} accessToken Access token for places
 * @returns {undefined}
 */
function getUserPlace(userId, placeId, accessToken) {
  return UserRepository.findOrCreate({ id: userId })
    .then(() => UserPlaceRepository.findOrCreate({
      place_id: placeId,
      user_id: userId,
    }))
    .then(userPlaceModel => (
      accessToken ? userPlaceModel.save({ placeAccessToken: accessToken }) : userPlaceModel
    ));
}

/**
 * Response handler for login.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissionsAndSendUnauthorized(req, res, LOGIN_USER)
    .then(() => verifyLoginJWT(req.body.token))
    .then(token => getUserPlace(token.sub, token.placeId, req.body.accessToken))
    .then(userPlaceModel =>
      getLocation(userPlaceModel)
        .then(location => {
          res
            .cacheControl('no-store')
            .status(200)
            .send({
              token: req.body.token,
              placeId: userPlaceModel.get('placeId'),
              location,
            });
        })
        .catch(UnauthorizedError, () => {
          // Get location from places failed, return place policy url instead of location:
          res
            .cacheControl('no-store')
            .status(200)
            .send({
              token: req.body.token,
              placeId: userPlaceModel.get('placeId'),
              placePolicyUrl: createPlacePolicyUrl(userPlaceModel.get('placeId')),
            });
        })
    )
    .catch(err => {
      debug.trace(`Failed to login: ${err.message}`);
      res
        .status(403)
        .json({ success: false, message: 'Inloggen mislukt.' });
    });
}
