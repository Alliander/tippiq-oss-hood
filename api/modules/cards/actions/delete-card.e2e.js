import BPromise from 'bluebird';
import _ from 'lodash';
import {
  app,
  request,
  getSignedJwt,
} from '../../../test/test-utils';
import postCardJsonReq from '../../../test/seeds/valid-card';
import testUsers from '../../../test/seeds/users';
import { TagRepository } from '../../tags/repositories';
import { ServiceTagRepository } from '../../services/repositories';
import { RolePermissionRepository } from '../../auth/repositories';


/**
 * Create tag
 * @function createTag
 * @param {string} label Label
 * @returns {object} Tag model
 */
function createTag(label) {
  return TagRepository
    .create({ label });
}

/**
 * White list tag
 * @function whiteListTag
 * @param {string} label Label
 * @param {string} serviceId The service id
 * @returns {object} Tag model
 */
function whiteListTag(label, serviceId) {
  return createTag(label)
    .then(tag => ServiceTagRepository
      .findAll({ service_id: serviceId })
      .then(serviceTags => ([
        { id: tag.id },
        ...serviceTags.map(serviceTag => ({ id: serviceTag.get('tagId') })),
      ]))
      .then(tags => ServiceTagRepository.updateTagsForService(serviceId, tags))
    );
}


/**
 * Delete white list tag
 * @function deleteWhiteListTag
 * @param {string} label Label
 * @param {string} serviceId The service id
 * @returns {Promise} Promise of deletion of the white list tag
 */
function deleteWhiteListTag(label, serviceId) {
  return ServiceTagRepository
    .deleteByService(serviceId)
    .then(() => TagRepository.findByLabel(label))
    .then(tag => TagRepository.deleteById(tag.get('id')))
    .catch(err => BPromise.reject(err));
}

describe('DELETE /cards/:id', () => {
  let token;
  let cardUrl;

  // Only admin user (with role administrator) has permissions.
  before('get token', () => getSignedJwt({ sub: testUsers[0].id }).then(authToken => {
    token = authToken;
  }));

  before('Tag42', () => whiteListTag('tag42', postCardJsonReq.serviceId));

  before('add card', () =>
    request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(postCardJsonReq)
      .expect(201)
      .expect(res => (cardUrl = res.header.location))
  );

  after('Tag42', () => deleteWhiteListTag('tag42', postCardJsonReq.serviceId));

  it('should require authentication', () =>
    request(app)
      .del(cardUrl)
      .set('Accept', 'application/json')
      .expect(403)
  );

  it('should exist', () =>
    request(app)
      .del(cardUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  );

  describe('ownership', () => {
    let tokenNonSuperuser;
    let rolePermissionId;
    let ownershipCardUrl;

    before('get token', () => getSignedJwt({ sub: testUsers[1].id }).then(authToken => {
      tokenNonSuperuser = authToken;
    }));

    before(() => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = 'card-that-will-not-be-deleted-by-owner';
      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(res => {
          ownershipCardUrl = res.header.location;
        });
    });

    after(() => RolePermissionRepository.deleteById(rolePermissionId));

    after(() =>
      request(app)
        .del(ownershipCardUrl)
        .set('Authorization', `Bearer ${token}`)
        .send()
    );

    it('should not be possible to delete a card you are not the owner of', () =>
      request(app)
        .del(ownershipCardUrl)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenNonSuperuser}`)
        .expect(403)
    );

    it('should be possible to delete a card you are the owner of', (done) => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = 'card-to-be-deleted-by-owner';

      // Temporary give authenticated users permissions to add a card
      RolePermissionRepository
        .createRolePermission({
          role: 'authenticated',
          permission: 'add_card',
        })
        .then(rolePermissionModel => {
          rolePermissionId = rolePermissionModel.get('id');

          request(app)
            .post('/cards')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokenNonSuperuser}`)
            .send(requestBody)
            .expect(res => (cardUrl = res.headers.location))
            .expect(201)
            .end(err => {
              if (err) {
                return done(err);
              }
              return request(app)
                .del(cardUrl)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenNonSuperuser}`)
                .send(requestBody)
                .expect(200)
                .end(() => done());
            });
        });
    });
  });

  it('should require an existing card id', () =>
    request(app)
      .del('/api/cards/non-existing-card-id')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(404)
  );

  it('should work only once', () =>
    request(app)
      .del(cardUrl)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(404)
  );
});
