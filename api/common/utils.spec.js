import { expect } from '../test/test-utils';

import { uppercase, bookshelfOptions } from './utils';

describe('Utils', () => {
  describe('uppercase', () => {
    it('should convert a string to an uppercase string', () =>
      expect(uppercase('abc')).to.equal('ABC')
    );
  });

  describe('bookshelfOptions', () => {
    it('should return an empty object when no transaction id is passed', () =>
      expect(bookshelfOptions()).to.eql({})
    );

    it('should return an object with the transacting id when an transaction id is passed', () =>
      expect(bookshelfOptions('1234')).to.eql({ transacting: '1234' })
    );
  });
});
