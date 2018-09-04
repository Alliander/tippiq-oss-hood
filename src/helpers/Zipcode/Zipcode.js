/**
 * Zipcode helper.
 * @module helpers/Zipcode
 */

/**
 * Zipcode helper.
 * @class Zipcode
 */
export default class Zipcode {
  /**
   * Constructor
   * @method constructor
   * @param {String} digits Zipcode digits
   * @param {String} letters Zipcode letters
   * @returns {undefined}
   */
  constructor(digits, letters) {
    this.digits = undefined;
    this.chars = undefined;
    if (digits && digits.length === 4 && parseInt(digits, 10)) {
      this.digits = digits;
    }
    if (letters && letters.length === 2) {
      this.chars = letters.toUpperCase();
    }
  }

  /**
   * To json
   * @method toJson
   * @returns {String} Formatted string
   */
  toString() {
    return `${this.digits}${this.chars ? ` ${this.chars}` : ''}`;
  }

  /**
   * From json
   * @method fromJson
   * @param {Object} data Zipcode data
   * @returns {Object} Zipcode object
   */
  static fromJson(data) {
    if (data && (data.chars || data.digits)) {
      return new Zipcode(data.digits, data.chars);
    }
    return null;
  }
}
