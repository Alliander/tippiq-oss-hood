import { UserRepository } from '../repositories';
import { expect } from '../../../test/test-utils';
import { ROLES } from '../../auth';

describe('UserModel', () => {
  it('should return true for a user that has the specified role', () =>
    UserRepository
      .findById('48181aa2-560a-11e5-a1d5-c7050c4109ab')
      .then(user => expect(user.hasRole(ROLES.ADMINISTRATOR)).to.equal(true))
  );

  it('should return false for a user without the specified role', () =>
    UserRepository
      .findById('42181aa2-560a-11e5-a1d5-c7050c4109ac')
      .then(user => expect(user.hasRole(ROLES.ADMINISTRATOR)).to.equal(false))
  );
});
