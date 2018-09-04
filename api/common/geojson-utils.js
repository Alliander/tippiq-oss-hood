/**
 * Utility functions for geoJson.
 * @module common/geojson-utils
 */

import { set } from 'lodash';

/**
 * Convert latitude/longitude to geoJson object
 * @function latLonToGeojson
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @returns {Object} geoJson
 */
export function latLonToGeojson(lat, lon) {
  return {
    type: 'Point',
    coordinates: [parseFloat(lon), parseFloat(lat)],
  };
}

// Spaklerweg 20, Amsterdam
export const geoJSONHouseAddress = { type: 'Point', coordinates: [4.91652093, 52.33773322] };

/**
 * Unmarshall GeoJson from Geometry
 * @function unmarshallGeoJsonFromGeometry
 * @param {Object} obj Object to modify
 * @param {Object} value Value to set (parse if needed)
 * @param {string} key Path to object property to modify
 * @returns {Object} Modified object
 */
export function unmarshallGeoJsonFromGeometry(obj, value, key) {
  set(obj, key, key === 'geometry' && typeof value === 'string' ? JSON.parse(value) : value);
}
