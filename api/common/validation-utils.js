/**
 * Validation utils.
 * @module common/validation-utils
 */

import geojsonhint from 'geojsonhint';
import { ValidationError } from './errors';

const uuidFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
const propertyFormat = /^[a-z][a-zA-Z0-9]+$/;
const emailFormat = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/i; // eslint-disable-line max-len

/**
 * Check if address type is valid
 * @function isValidAddressType
 * @param {string} type Address type
 * @returns {boolean} success
 */
export function isValidAddressType(type) {
  const validTypes = ['NetherlandsAddress', 'ProvinceAddress', 'MunicipalityAddress',
    'CityAddress', 'ZipcodeAddress', 'StreetAddress', 'HouseAddress'];
  return validTypes.indexOf(type) > -1;
}

/**
 * Check if geoJson is valid
 * @function bookshelfOptions
 * @param {Object} geoJson GeoJson object
 * @returns {boolean} success
 */
export function isValidGeoJson(geoJson) {
  const errors = geojsonhint.hint(geoJson);
  return errors.length < 1;
}

/**
 * Check valid UUID.
 * @function isValidUUID
 * @param {string} input Input to check.
 * @returns {boolean} True if valid UUID.
 */
export function isValidUUID(input) {
  return uuidFormat.test(input);
}

/**
 * Check if field exists and has length between .
 * @function validateFieldExistsAndHasLengthBetween
 * @param {string} fieldValue Field value to check.
 * @param {string} fieldName Name of the field to check
 * @param {Number} min Minimum field length
 * @param {Number} max Maximum field length
 * @returns {ValidationError|boolean} If check fails ValidationError or true
 */
export function validateFieldExistsAndHasLengthBetween(fieldValue, fieldName, min, max) {
  if (typeof fieldValue === 'undefined' ||
    fieldValue === null ||
    fieldValue.length < min ||
    fieldValue.length > max) {
    throw new ValidationError(
      `Invalid ${fieldName}: length should be a minimum of ${min} and a maximum of ${max} characters.`);
  }
  return true;
}

/**
 * Check the document property format.
 * @function isValidDocumentPropertyFormat
 * @param {string} input Input to check.
 * @returns {boolean} True if valid property.
 */
export function isValidDocumentPropertyFormat(input) {
  return propertyFormat.test(input);
}

/**
 * Check the image property format.
 * @function isValidImagePropertyFormat
 * @param {string} input Input to check.
 * @returns {boolean} True if valid property.
 */
export function isValidImagePropertyFormat(input) {
  return propertyFormat.test(input);
}

/**
 * Check the email address.
 * @function isValidEmailAddress
 * @param {string} input Input to check.
 * @returns {boolean} True if valid property.
 */
export function isValidEmailAddress(input) {
  return emailFormat.test(input);
}
