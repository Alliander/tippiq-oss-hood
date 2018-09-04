import { UserRepository } from '../../users/repositories/index';
import UserPlaceRepository from './user-place-repository';
import { expect } from '../../../test/test-utils';

describe('UserPlaceRepository', () => {
  describe('find and create method', () => {
    let userPlaceId;
    const userId = 'bdf22a9b-7861-4376-a295-aed22a064ba1';
    before('create a user', () =>
      UserRepository.create({ id: userId, name: 'user-place-repo-test-user' }, { method: 'insert' })
    );

    after('destroy user place record', () => UserPlaceRepository.deleteById(userPlaceId));
    after('destroy user', () => UserRepository.deleteById(userId));

    const userPlaceData = {
      user_id: userId,
      place_id: '59be92df-e0b0-4e47-975b-91b206c61a6c',
    };

    it('should not find user place', () =>
      expect(UserPlaceRepository.findOne(userPlaceData)).to.be.rejected
    );

    it('should create the user place', () =>
      UserPlaceRepository.findOrCreate(userPlaceData)
        .tap(model => {
          userPlaceId = model.get('id');
          expect(model.attributes).to.have.property('userId');
          expect(model.attributes).to.have.property('placeId');
          expect(model.attributes).not.to.have.property('placeAccessToken');
        })
    );

    it('should find the user place instead of creating it', () =>
      UserPlaceRepository.findOrCreate(userPlaceData)
        .tap(model => {
          expect(model.id).to.equals(userPlaceId);
          expect(model.attributes).to.have.property('userId');
          expect(model.attributes).to.have.property('placeId');
          expect(model.attributes).to.have.property('location');
          expect(model.attributes).to.have.property('placeAccessToken');
        })
    );
  });
});
