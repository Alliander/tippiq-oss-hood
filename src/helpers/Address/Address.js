/**
 * Address helper.
 * @module helpers/Address
 */

import { compact } from 'lodash';
import { Zipcode } from '../';

const validTypes = [
  'NetherlandsAddress',
  'ProvinceAddress',
  'MunicipalityAddress',
  'CityAddress',
  'ZipcodeAddress',
  'StreetAddress',
  'HouseAddress',
];

/**
 * Address helper.
 * @class Address
 */
export default class Address {
  /**
   * Constructor
   * @method constructor
   * @param {Object} Address object
   * @returns {undefined}
   */
  constructor({ type, province, municipality, city, zipcode, street, house, geometry }) {
    this.type = type || 'HouseAddress';
    this.province = province;
    this.municipality = municipality;
    this.city = city;
    this.street = street;
    this.zipcode = zipcode;
    this.house = {
      number: house && house.number ? parseInt(house.number, 10) || undefined : undefined,
      suffix: house && house.suffix ? house.suffix : undefined,
    };
    this.geometry = geometry;
  }

  /**
   * From json
   * @method fromJson
   * @param {Object} data Address data
   * @returns {Object} Address object
   */
  static fromJson(data) {
    if (data && data.type && validTypes.indexOf(data.type) >= 0) {
      return new Address({
        type: data.type,
        province: data.provinceName,
        municipality: data.municipalityName,
        city: data.cityName,
        zipcode: Zipcode.fromJson({ chars: data.zipcodeLetters, digits: data.zipcodeDigits }),
        street: data.streetName,
        house: { number: data.nr, suffix: `${data.addition || ''}${data.letter || ''}` },
        geometry: data.geometry,
      });
    }
    return '';
  }

  /**
   * To search string
   * @method toSearchString
   * @returns {String} Formatted string
   */
  toSearchString() {
    const street = compact([this.street, this.house.number, this.house.suffix]).join(' ');
    const zipcode = this.zipcode ? compact([this.zipcode.digits, this.zipcode.chars]).join('') :
      null;
    return compact([street, zipcode, this.city, this.country]).join(', ');
  }

  /**
   * To string
   * @method toString
   * @returns {String} Formatted string
   */
  toString() {
    const zipcode = this.zipcode ? this.zipcode.toString() : undefined;
    const streetAddress = compact([this.street, this.house.number, this.house.suffix]).join(' ');
    const zipcodeAndCity = compact([zipcode, this.city]).join(' ');
    const fullStreetAddress = compact([streetAddress, this.city]).join(' ');
    const fullAddress = [streetAddress, zipcodeAndCity].join(' ');
    return {
      NetherlandsAddress: 'Heel Nederland',
      ProvinceAddress: `Provincie ${this.province}`,
      MunicipalityAddress: `Gemeente ${this.municipality} (${this.province})`,
      CityAddress: this.city === this.municipality ? this.city : `${this.city} (${this.municipality})`,
      ZipcodeAddress: this.zipcode && this.zipcode.chars ? fullAddress : `Postcodegebied ${zipcodeAndCity}`,
      StreetAddress: fullStreetAddress,
      HouseAddress: fullAddress,
    }[this.type];
  }

  /**
   * To short string
   * @method toShortString
   * @returns {String} Formatted string
   */
  toShortString() {
    const zipcode = this.zipcode ? this.zipcode.toString() : undefined;
    const streetAddress = compact([this.street, this.house.number, this.house.suffix]).join(' ');
    const zipcodeAndCity = compact([zipcode, this.city]).join(' ');
    const fullAddress = [streetAddress, zipcodeAndCity].join(' ');
    return {
      NetherlandsAddress: 'Heel Nederland',
      ProvinceAddress: `Provincie ${this.province}`,
      MunicipalityAddress: `Gemeente ${this.municipality} (${this.province})`,
      CityAddress: this.city === this.municipality ? this.city : `${this.city} (${this.municipality})`,
      ZipcodeAddress: this.zipcode && this.zipcode.chars ? fullAddress : `Postcodegebied ${zipcodeAndCity}`,
      StreetAddress: streetAddress,
      HouseAddress: streetAddress,
    }[this.type];
  }
}
