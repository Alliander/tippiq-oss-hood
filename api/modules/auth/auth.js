/**
 * Auth Helper functions
 * @module auth
 */
import BPromise from 'bluebird';
import { defaults, isEqual, intersection } from 'lodash';
import debugLogger from 'debug-logger';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import config from '../../config';
import { sendUnauthorized } from '../../common/route-utils';
import { AuthenticationError, UnauthorizedError } from '../../common/errors';
import { RolePermissionRepository } from './repositories';

const debug = debugLogger('tippiq-hood:auth');

const ROLES = Object.freeze({
  ANONYMOUS: 'anonymous',
  AUTHENTICATED: 'authenticated',
  OWNER: 'owner',
  ADMINISTRATOR: 'administrator',
});

const ACTIONS = Object.freeze({
  SEND_MESSAGE: 'tippiq_places.send-message',
  UNSUBSCRIBE_WEEKLY_NOTIFICATION: 'tippiq-hood.unsubscribe_weekly_notification',
  LOGIN_SESSION: 'tippiq-hood.login_session',
});

/**
 * Verify the token against the configured audience and issuer and return the payload.
 * @param {string} token To decode
 * @param {string} [action] If present, the action field in the payload must be equal.
 * @returns {Promise<Object>} JWT payload object
 */
function verifyTippiqIdJWT(token, action) {
  return BPromise
    .try(() => jwt.verify(
      token,
      config.tippiqIdPublicKey,
      {
        audience: config.oAuth2ClientId,
        issuer: config.tippiqIdJwtIssuer,
      })
    )
    .catch(err => {
      debug.trace(err);
      throw new AuthenticationError(err.message);
    })
    .tap(payload => {
      if (action) {
        if (!payload.action || !isEqual(action, payload.action)) {
          throw new AuthenticationError(`Invalid action: ${payload.action}`);
        }
      }
    });
}

/**
 * Verify the token against the configured audience and issuer and return the payload.
 * @param {string} token To decode
 * @param {string} [action] If present, the action field in the payload must be equal.
 * @returns {Promise<Object>} JWT payload object
 */
function verifyTippiqHoodJWT(token, action) {
  return BPromise
    .try(() => jwt.verify(
      token,
      config.tippiqHoodPublicKey,
      {
        audience: config.oAuth2ClientId,
        issuer: config.jwtIssuer,
      })
    )
    .catch(err => {
      debug.trace(err);
      throw new AuthenticationError(err.message);
    })
    .tap(payload => {
      if (action) {
        if (!payload.action || !isEqual(action, payload.action)) {
          throw new AuthenticationError(`Invalid action: ${payload.action}`);
        }
      }
    });
}

/**
 * Verify the token against tippiqId and tippiqHood and return payload for which is successful
 * @param {string} token To decode
 * @returns {Promise<Object>} JWT payload object
 */
function verifyLoginJWT(token) {
  return BPromise.any([
    verifyTippiqHoodJWT(token, ACTIONS.LOGIN_SESSION),
    verifyTippiqIdJWT(token),
  ]).catch(err => {
    debug.trace(err);
  });
}

/**
 * Validate the permissions.
 * @function validatePermissions
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {string} permission Permissions to check for
 * @param {Array} localRoles Array of local roles
 * @returns {Promise} Resolves only if permissions validate
 */
function validatePermissions(req, res, permission, localRoles = []) {
  let user = 'anonymous';
  let myRoles = [ROLES.ANONYMOUS, ...localRoles];
  if (req.user && req.user.get('id')) {
    myRoles = [
      ROLES.AUTHENTICATED,
      ...myRoles,
      ...req.user.related('roles').map(role => role.get('name')),
    ];
    user = req.user.get('id');
  }

  return RolePermissionRepository
    .findRolesByPermission(permission)
    .then(collection => {
      const permissionRoles = collection.map(rolePermission => rolePermission.get('role'));
      if (intersection(myRoles, permissionRoles).length === 0) {
        throw new UnauthorizedError(user);
      }
    });
}

/**
 * Validate the permissions.
 * @function validatePermissionsAndSendUnauthorized
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {string} permission Permissions to check for
 * @param {Array} localRoles Array of local roles
 * @deprecated Use validatePermissions instead and handle Unauthorized error outside auth layer
 * @returns {Promise} Resolves only if permissions validate, send unauthorized otherwise
 */
function validatePermissionsAndSendUnauthorized(req, res, permission, localRoles = []) {
  return new BPromise(resolve => {
    validatePermissions(req, res, permission, localRoles)
      .then(() => {
        resolve();
      })
      .catch(UnauthorizedError, (err) => {
        sendUnauthorized(res, err.user, permission);
        // reject is explicitly not called and the chain is broken. All legacy code assumes that
        // an error response is already sent.
      });
  });
}

/**
 * Parse the Authentication header for Tippiq Id token and add a user object to the request when
 * it is results in a valid user.
 * @function performTippiqIdAuthenticationLogic
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback
 * @returns {undefined}
 */
function performTippiqIdAuthenticationLogic(req, res, next) {
  passport.authenticate('jwtId', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Parse the Authentication header for Tippiq Hood token and add a user object to the request when
 * it is results in a valid user.
 * @function performTippiqHoodAuthenticationLogic
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback
 * @returns {undefined}
 */
function performTippiqHoodAuthenticationLogic(req, res, next) {
  passport.authenticate('jwtHood', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Generate a signed JWT for a Service call to Places.
 * @function getSignedPlacesJwt
 * @param {Object} [payload] To include in the token.
 * @returns {Promise<string>} JWT
 */
function getSignedPlacesJwt(payload) {
  const JWT_OPTIONS = {
    algorithm: 'RS256',
    audience: config.jwtAudiencePlaces,
    expiresIn: '5m',
    issuer: config.jwtIssuer,
  };
  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, JWT_OPTIONS);
  return BPromise.try(() => jwt.sign(jwtPayload, config.tippiqHoodPrivateKey, jwtOptions));
}

/**
 * Generate a signed JWT for a Service call to Hood.
 * @function getSignedHoodJwt
 * @param {Object} [payload] To include in the token.
 * @returns {Promise<string>} JWT
 */
function getSignedHoodJwt(payload) {
  const JWT_OPTIONS = {
    algorithm: 'RS256',
    audience: config.oAuth2ClientId,
    expiresIn: '7d',
    issuer: config.jwtIssuer,
  };
  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, JWT_OPTIONS);
  return BPromise.try(() => jwt.sign(jwtPayload, config.tippiqHoodPrivateKey, jwtOptions));
}

export default {
  ROLES,
  ACTIONS,
  verifyTippiqHoodJWT,
  verifyLoginJWT,
  validatePermissions,
  validatePermissionsAndSendUnauthorized,
  performTippiqIdAuthenticationLogic,
  performTippiqHoodAuthenticationLogic,
  getSignedPlacesJwt,
  getSignedHoodJwt,
};
