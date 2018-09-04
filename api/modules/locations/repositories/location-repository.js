/**
 * Location repository.
 * @module modules/locations/repositories/location-repository
 */

import autobind from 'autobind-decorator';
import BPromise from 'bluebird';

import BaseRepository from '../../../common/base-repository';
import { knex } from '../../../common/bookshelf';

import { Location } from '../models';
import { getLocationByAddressType } from '../../../addressesMicroservice/addressesApi';
import { bookshelfOptions } from '../../../common/utils';

/**
 * parse geometry json
 * @function jsonParseLocationGeometry
 * @param {Object} locationArg location
 * @returns {Object} location with parsed geometry
 */
function jsonParseLocationGeometry(locationArg) {
  const location = locationArg;
  location.attributes.geometry = JSON.parse(location.attributes.geometry);
  return location;
}

@autobind
  /**
   * A Repository for Locations.
   * @class LocationRepository
   * @extends BaseRepository
   */
class LocationRepository extends BaseRepository {
  /**
   * Construct a CardRepository for Cards.
   * @constructs CardRepository
   */
  constructor() {
    super(Location);
  }

  /**
   * Find a location by Id
   * @function findById
   * @param {string} id Location id
   * @returns {Object} Card
   */
  findById(id) {
    return this.findOne({ id });
  }

  /**
   * Find a location
   * @function findOne
   * @param {Object} where Filter by
   * @returns {Object} Card
   */
  static findOne(where) {
    return Location
      .where(where)
      .fetch({
        require: true,
        columns: [
          knex.raw('location.*'),
          knex.st.dutchGeometryToGeoJSON('location.geometry').as('geometry'),
        ],
      })
      .then(jsonParseLocationGeometry);
  }

  /**
   * Create location
   * @function createLocation
   * @param {Object} locationJson location
   * @param {Object} transaction Bookshelf transaction
   * @returns {Object} locationModel
   */
  createLocation(locationJson, transaction) {
    if (typeof locationJson.address !== 'undefined') {
      return getLocationByAddressType(locationJson)
        .then(location => super.create(location, bookshelfOptions(transaction)));
    }
    if (typeof locationJson.geometry !== 'undefined') {
      return this.locationFromGeometry(locationJson.geometry)
        .then(geometryLocation => geometryLocation.save(null, bookshelfOptions(transaction)));
    }
    throw new Error('Processing unknown location type: neither geometry nor address specified.');
  }

  /**
   * Converts geometry to a location
   * @function locationFromGeometry
   * @param {object} geometryInput Geometry to convert
   * @returns {Promise<Location>} Promise that resolves to a location
   */
  locationFromGeometry(geometryInput) { // eslint-disable-line complexity
    let location;

    switch (geometryInput.type) {
      case 'Point':
      case 'MultiPoint':
      case 'LineString':
      case 'MultiLineString':
      case 'Polygon':
      case 'MultiPolygon':
        location = new Location({
          type: geometryInput.type,
          geometry: this.geoJsonToGeometry(geometryInput),
        });
        break;

      default:
        throw new Error(`Unknown geometry type: ${geometryInput.type}`);
    }
    return BPromise.resolve(location);
  }

  /**
   * Converts Geojson to Geometry
   * @function geoJsonToGeometry
   * @param {object} input Input Geojson
   * @return {object} Geometry
   */
  geoJsonToGeometry(input) {
    return knex.st.dutchGeometryFromGeoJSON({
      type: input.type,
      coordinates: input.coordinates,
    });
  }
}

export { Location };

export default new LocationRepository();
