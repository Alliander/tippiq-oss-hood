/**
 * Utility functions for testing
 * @module common/test-utils
 */

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import debugLogger from 'debug-logger';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiThings from 'chai-things';
import BPromise from 'bluebird';
import jwt from 'jsonwebtoken';
import request from 'supertest-as-promised';

import config from '../config';
import interceptAddresses from './tippiq-addresses-api-mock';
import interceptPlaces from './tippiq-places-api-mock';

export chai, { expect } from 'chai';
export request from 'supertest-as-promised';
export app from '../api';

const debug = debugLogger('tippiq-hood:test:test-utils');

export const uuidRegexString = '[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}';

chai.use(chaiAsPromised);
chai.use(chaiThings);

/* this private key should be used for testing/local dev only */
const tippiqIdPrivateKey = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIJr08Kf8I7x/CPF87tLAbs3LpyYXk5IU0Np18+8nxK8FoAcGBSuBBAAK
oUQDQgAEIwr0ttbt6S6lj3e8nuP3KN/clEw1RICwk5d2Yy4hgKn7e6kBjeORFNnQ
DNj5GIGNmK0zb3SzW17JNzf22ooavQ==
-----END EC PRIVATE KEY-----`;

const JWT_EXPIRATION = '7d';
const JWT_OPTIONS = {
  algorithm: 'RS256',
  audience: config.oAuth2ClientId,
  expiresIn: JWT_EXPIRATION,
  issuer: config.tippiqIdJwtIssuer,
};

/**
 * Generate a signed JWT with defaults for the audience and issuer.
 * @function getSignedJwt
 * @param {Object} [payload] To include in the token.
 * @param {Object} [options] To create the token with.
 * @param {string} [privateKey] To create the token with (use tippiq Id private key when omitted)
 * @returns {Promise<string>} JWT
 */
export function getSignedJwt(payload, options, privateKey) {
  const jwtPayload = Object.assign({}, payload);
  const jwtOptions = Object.assign({}, JWT_OPTIONS, options);
  return BPromise.try(() => jwt.sign(jwtPayload, privateKey || tippiqIdPrivateKey, jwtOptions));
}

/**
 * End handler to process error or return done callback
 * @function endHandler
 * @param {Function} done Done callback
 * @return {Function} Function that returns a debug info or done callback
 */
export function endHandler(done) {
  return (err, res) => {
    if (err) {
      debug(JSON.stringify({
        errorMessage: err.toString(),
        body: res.body,
      }, null, 2));
      return done(err);
    }
    return done();
  };
}

/**
 * Logs a user in the system
 * @param {object} app App
 * @param {string} email Email address
 * @param {string} password Password
 * @return {Request} Login user request
 */
export function login(app, email, password) {
  const requestJson = {
    email,
    password,
  };
  return request(app)
    .post('/api/users/login')
    .set('Accept', 'application/json')
    .send(requestJson);
}

/**
 * The Tippiq Addresses API mock interceptor
 * @returns {object} Intercepted api call
 */
export function mockTippiqAddressesApi() {
  interceptAddresses(config.tippiqAddressesBaseUrl);
}

/**
 * The Tippiq Places API mock interceptor
 * @returns {object} Intercepted api call
 */
export function mockTippiqPlacesApi() {
  interceptPlaces(config.tippiqPlacesBaseUrl);
}
