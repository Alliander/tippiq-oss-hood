import { expect } from 'chai';
import { generateStringWithLength } from './string-utils';

describe('the string utils', () => {
  describe('generating a string', () => {
    it('should generate a string with the exact given length', () => {
      const string = generateStringWithLength(42);
      expect(string.length).to.equal(42);
    });
  });
});
