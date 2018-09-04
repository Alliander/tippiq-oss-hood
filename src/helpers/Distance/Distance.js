/**
 * Distance Helper.
 * @module helpers/Distance
 */

/**
* Distance from user till card pos
* @method getDistance
* @param {Object} distance Distance
* @returns {string} Distance distance.
*/
export default function getDistance(distance) {
  if (!distance) return '';
  if (distance > 999) {
    return `${parseInt(distance / 1000, 10)} km`;
  }
  return `${parseInt(distance, 10)} m`;
}
