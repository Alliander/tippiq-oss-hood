/* eslint no-param-reassign:0, no-cond-assign:0 */

/**
 * Checks to see if a parent element contains a child element
 * @module helpers/Dom/contains
 */

/**
 * @function contains
 * @param {Object} parent Parent container
 * @param {Object} child Child element
 * @returns {boolean} Is child of parent
 */
export default function (parent, child) {
  do {
    if (parent === child) {
      return true;
    }
  } while (child && (child = child.parentNode));
  return false;
}
