/**
 * Location validation.
 * @module modules/locations/location-validation
 */

import BPromise from 'bluebird';

import { ValidationError } from '../../common/errors';
import { isValidAddressType, isValidGeoJson } from '../../common/validation-utils';

/**
 * Check if location is not a string
 * @function validateObject
 * @param {Object} location Location to validate
 * @returns {Promise} A Promise that resolves.
 */
function validateObject(location) {
  if (typeof location === 'string') {
    throw new ValidationError('Invalid location: the location must not be a string.');
  }
}

/**
 * Check if address type is valid
 * @function validateType
 * @param {Object} location Location to validate
 * @returns {Promise} A Promise that resolves.
 */
function validateType(location) {
  if (!location.address) {
    return;
  }

  if (!isValidAddressType(location.address.type)) {
    throw new ValidationError('Invalid type: type is not a valid AddressType.');
  }
}

/**
 * Check if address city is valid
 * @function validateCityAddress
 * @param {Object} location Location to validate
 * @returns {Promise} A Promise that resolves.
 */
function validateCityAddress(location) {
  if (!location.address || location.address.type !== 'CityAddress') {
    return;
  }

  if (!location.address.city) {
    throw new ValidationError('Invalid CityAddress: city is required.');
  }
}

/**
 * Check if geoJson is valid
 * @function validateGeometry
 * @param {Object} location Location to validate
 * @returns {Promise} A Promise that resolves.
 */
function validateGeometry(location) {
  if (!location.geometry) {
    return;
  }

  if (!isValidGeoJson(location.geometry)) {
    throw new ValidationError('Invalid geometry: the given GeoJSON is invalid.');
  }
}

/**
 * Check if geoJson is valid
 * @function validateLocation
 * @param {Object} location Location to validate
 * @returns {Promise} A Promise that resolves.
 */
export function validateLocation(location) {
  // TODO: Add validation for all address types to check if required properties are present
  return BPromise.resolve(location)
    .tap(validateObject)
    .tap(validateType)
    .tap(validateCityAddress)
    .tap(validateGeometry);
}
