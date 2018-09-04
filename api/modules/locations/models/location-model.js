/**
 * LocationModel.
 * @module modules/locations/models/location-model
 */

import debugLogger from 'debug-logger';
import { chain, identity } from 'lodash';
import BaseModel from '../../../common/base-model';
import { unmarshallGeoJsonFromGeometry } from '../../../common/geojson-utils';

const debug = debugLogger('tippiq-hood:locations:model');

const instanceProps = {
  tableName: 'location',
  serialize(optionsArg) { // eslint-disable-line complexity
    const options = Object.assign({}, { omitPivot: true }, optionsArg);
    switch (options.context) {
      case 'card':
      case 'card-stream':
      case 'card-cta-redirect':
      case 'organization':
      case 'service':
      case 'email:weekly-notification':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pickBy((value, key) => ((key === 'distance') || identity(value)))
          .omit(['id', 'card', 'location'])
          .transform(unmarshallGeoJsonFromGeometry)
          .value();

      case 'place':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick([
            'type',
            'geometry',
            'nr',
            'addition',
            'letter',
            'streetName',
            'zipcodeLetters',
            'zipcodeDigits',
            'cityName',
            'municipalityName',
            'provinceName',
            'buildingType',
          ])
          .transform(unmarshallGeoJsonFromGeometry)
          .value();

      case 'organization:partner':
        return {};

      default:
        debug('unknown serialization context \'%s\'', options.context);
        return {};
    }
  },
  updateWith(update) {
    this.set({
      type: update.type,
      geometry: update.geometry,
      nr: update.nr,
      addition: update.addition,
      letter: update.letter,
      streetName: update.streetName,
      zipcodeLetters: update.zipcodeLetters,
      zipcodeDigits: update.zipcodeDigits,
      cityName: update.cityName,
      municipalityName: update.municipalityName,
      provinceName: update.provinceName,
      buildingType: update.buildingType,
    });
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
