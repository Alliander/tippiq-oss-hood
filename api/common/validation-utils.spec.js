import { expect } from 'chai';
import {
  isValidEmailAddress,
  validateFieldExistsAndHasLengthBetween,
} from './validation-utils';

describe('the validation utils', () => {
  describe('validation of field existence and between length', () => {
    it('should be valid when a field exists', () => {
      expect(validateFieldExistsAndHasLengthBetween('foo', 'bar', 1, 3)).to.equal(true);
    });

    it('should be valid when the length fits', () => {
      expect(validateFieldExistsAndHasLengthBetween('foo', 'bar', 1, 4)).to.equal(true);
    });

    it('should throw an ValidationError if the field is undefined', () => {
      expect(() => validateFieldExistsAndHasLengthBetween(undefined, 'bar', 1, 3)).to.throw(
        'ValidationError: Invalid bar: length should be a minimum of 1 and a maximum of 3 characters.');
    });

    it('should throw an ValidationError if the field is null', () => {
      expect(() => validateFieldExistsAndHasLengthBetween(null, 'bar', 1, 3)).to.throw(
        'ValidationError: Invalid bar: length should be a minimum of 1 and a maximum of 3 characters.');
    });

    it('should throw an ValidationError if length is greater than allowed', () => {
      expect(() => validateFieldExistsAndHasLengthBetween(null, 'bar', 1, 2)).to.throw(
        'ValidationError: Invalid bar: length should be a minimum of 1 and a maximum of 2' +
        ' characters.');
    });
  });

  describe('validation of an email address', () => {
    it('should be valid when email address contains @ and domain', () => {
      expect(isValidEmailAddress('valid@gmail.com')).to.equal(true);
    });

    it('should be valid when email address contains + sign', () => {
      expect(isValidEmailAddress('valid+1@gmail.com')).to.equal(true);
    });

    it('should be invalid when email address doesn\'t contain @ and domain', () => {
      expect(isValidEmailAddress('invalid')).to.equal(false);
    });
  });
});
