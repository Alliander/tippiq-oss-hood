import request from 'superagent';
import debugLogger from 'debug-logger';
import BPromise from 'bluebird';
import config from '../config';

const addressesUrl = `${config.tippiqAddressesBaseUrl}/api/addresses`;
const debug = debugLogger('tippiq-hood:addressesMicroservice:addressesApi');

/**
 * Gets a location by an address with address type
 * @function getLocationByAddressType
 * @param {object} location The location address
 * @returns {Promise} A location model
 */
export function getLocationByAddressType(location) {
  return request
    .post(`${addressesUrl}/find-by-address-type`)
    // .set('Authorization', `Bearer ${userToken}`) TODO Add authentication
    .send(location)
    .then(result => result.body)
    .catch(e => {
      debug(e);
    });
}

/**
 * Search addresses using the given query
 * @function search
 * @param {string} query The query
 * @returns {Promise} An array of addresses
 * @throws TimeoutError when the addresses microservice takes too long to respond
 */
export function search(query) {
  if (!query || query.length < 2) {
    return BPromise.resolve([]);
  }
  const timeout = 1000;
  const max = 8;
  return BPromise
    .resolve(
      request
        .get(`${addressesUrl}/search`)
        .query({ query, max, timeout })
        // .set('Authorization', `Bearer ${userToken}`) TODO Add authentication
        .send()
        .then(result => result.body))
    .timeout(timeout + 10);
}
