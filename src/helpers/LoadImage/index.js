/**
 * Load image helper.
 * @module helpers/LoadImage
 */

/**
 * Load image.
 * @function loadImage
 * @param {string} fileName Input filename
 * @returns {string} File url
 */
export function loadImage(fileName) {
  return __STATIC__ + fileName;
}
