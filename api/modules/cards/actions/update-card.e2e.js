import _ from 'lodash';
import BPromise from 'bluebird';
import {
  app,
  expect,
  request,
  endHandler,
  getSignedJwt,
} from '../../../test/test-utils';
import testUsers from '../../../test/seeds/users';
import putCardJsonRequest from '../../../test/seeds/valid-card';
import { RolePermissionRepository } from '../../auth/repositories';
import { TagRepository } from '../../tags/repositories';
import { ServiceTagRepository } from '../../services/repositories';

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
 * Delete the service tags
 * @function deleteServiceTags
 * @param {string} serviceId The service Id to delete tags for
 * @returns {Promise} Promise that resolves to deleted service tags
 */
function deleteServiceTags(serviceId) {
  let tagIds = [];
  return ServiceTagRepository
    .findAll({ service_id: serviceId })
    .then(serviceTags => {
      tagIds = serviceTags.map(serviceTag => serviceTag.get('tagId'));
    })
    .then(() => ServiceTagRepository.deleteByService(serviceId))
    .tap(() => BPromise.all(tagIds.map(id => TagRepository.deleteById(id))));
}

/**
 * Create delete card request
 * @function createDeleteCardRequest
 * @param {string} url Url
 * @param {string} token The token
 * @returns {undefined}
 */
function createDeleteCardRequest(url, token) {
  return request(app)
    .del(url)
    .set('Authorization', `Bearer ${token}`);
}

describe('PUT /cards/:id', () => { // eslint-disable-line max-statements
  let token;
  let cardId;
  let cardAddUrl;

  before('Get token', () => getSignedJwt({ sub: testUsers[0].id }).then(authToken => {
    token = authToken;
  }));

  before('Tag42', () => whiteListTag('tag42', putCardJsonRequest.serviceId));
  before('Tag1', () => whiteListTag('tag1', putCardJsonRequest.serviceId));
  before('Tag2', () => whiteListTag('tag2', putCardJsonRequest.serviceId));

  before('Create card', () =>
    request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(putCardJsonRequest)
      .expect(201)
      .expect(response => {
        cardAddUrl = response.headers.location;
        cardId = response.body.id;
      })
  );

  after('Delete card', () => createDeleteCardRequest(cardAddUrl, token));

  after('Delete white list tags', () => deleteServiceTags(putCardJsonRequest.serviceId));

  it('should require authentication', () =>
    request(app)
      .put(`/cards/${cardId}`)
      .set('Accept', 'application/json')
      .send(putCardJsonRequest)
      .expect(403)
  );

  it('should fail when there is no card with the specified id', () => {
    const requestBody = _.clone(putCardJsonRequest);
    requestBody.id = '18a26036-5626-11e5-88cc-a78461558d6d';

    request(app)
      .put('/cards/18a26036-5626-11e5-88cc-a78461558d6d')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(404);
  });

  describe('ownership', () => {
    let tokenNonSuperuser;
    let rolePermissionId;
    let cardUrl;

    before('Get token', () => getSignedJwt({ sub: testUsers[1].id }).then(authToken => {
      tokenNonSuperuser = authToken;
    }));

    after('delete add card permission', () => RolePermissionRepository.deleteById(rolePermissionId));

    after('cleanup test data', () => {
      const deleteCardPromises = [];
      if (cardUrl) {
        deleteCardPromises.push(createDeleteCardRequest(cardUrl, tokenNonSuperuser));
      }

      return Promise
        .all(deleteCardPromises)
        .then(() => {
          cardUrl = null;
        });
    });

    it('should not be possible to update a card you are not the owner of', () => {
      const requestBody = _.clone(putCardJsonRequest);

      request(app)
        .put(`/cards/${cardId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenNonSuperuser}`)
        .send(requestBody)
        .expect(403);
    });

    it('should be possible to update a card you are the owner of', (done) => {
      let newCardId;
      const requestBody = _.clone(putCardJsonRequest);
      requestBody.externalId = 'card-that-will-be-updated';

      // temporary give authenticated users permissions to add a card
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
            .expect(res => {
              cardUrl = res.headers.location;
            })
            .expect(201)
            .end((err, res) => {
              if (err) {
                done(err);
              }
              newCardId = res.body.id;

              request(app)
                .put(`/cards/${newCardId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenNonSuperuser}`)
                .send(requestBody)
                .expect(200)
                .end(errSecondRequest => {
                  if (errSecondRequest) {
                    done(errSecondRequest);
                  }
                  done();
                });
            });
        });
    });
  });

  it('should add new tags when present in the update request body', () => {
    const requestBody = _.clone(putCardJsonRequest);
    requestBody.tags = ['tag1', 'tag2'];

    return request(app)
      .put(`/cards/${cardId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(200)
      .expect(res => {
        expect(res.body).to.have.property('tags');

        const tags = [res.body.tags[0].label, res.body.tags[1].label];
        expect(tags).to.contain('tag1');
        expect(tags).to.contain('tag2');
      });
  });

  it('should remove tags when not present on update', () => {
    const requestBody = _.clone(putCardJsonRequest);
    requestBody.tags = [];

    return request(app)
      .put(`/cards/${cardId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(200)
      .expect(res => {
        expect(res.body.tags).to.be.empty; // eslint-disable-line no-unused-expressions
      });
  });

  describe('should update the location with the new', () => {
    /**
     * Updates the address and assert
     * @function updateAddressAndAssert
     * @param {object} address The address to update
     * @param {object} expectation Expectation
     * @param {function} done Done
     * @returns {object} Returns the promise of the assert
     */
    function updateAddressAndAssert(address, expectation, done) {
      const requestBody = _.clone(putCardJsonRequest);
      requestBody.locations = [{ address }];

      request(app)
        .put(`/cards/${cardId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(200)
        .expect(expectation)
        .end(endHandler(done));
    }

    it('HouseAddress', (done) => {
      const address = {
        type: 'HouseAddress',
        zipcode: {
          digits: '1011',
          chars: 'AB',
        },
        house: {
          number: '105',
          suffix: 'H',
        },
      };
      updateAddressAndAssert(
        address,
        (res) => {
          expect(res.body).to.have.deep.property('locations[0].type', address.type);
          expect(res.body).to.have.deep.property('locations[0].zipcodeDigits', address.zipcode.digits);
          expect(res.body).to.have.deep.property('locations[0].zipcodeLetters', address.zipcode.chars);
          expect(res.body).to.have.deep.property('locations[0].nr', address.house.number);
          expect(res.body).to.have.deep.property('locations[0].addition', address.house.suffix);
        },
        done);
    });

    it('Zipcode6Address', (done) => {
      const address = {
        type: 'ZipcodeAddress',
        zipcode: {
          digits: '1011',
          chars: 'AB',
        },
      };
      updateAddressAndAssert(
        address,
        (res) => {
          expect(res.body).to.have.deep.property('locations[0].type', address.type);
          expect(res.body).to.have.deep.property('locations[0].zipcodeDigits', address.zipcode.digits);
          expect(res.body).to.have.deep.property('locations[0].zipcodeLetters', address.zipcode.chars);
        },
        done);
    });

    it('Zipcode4Address', (done) => {
      const address = {
        type: 'ZipcodeAddress',
        zipcode: {
          digits: '1011',
        },
      };
      updateAddressAndAssert(
        address,
        (res) => {
          expect(res.body).to.have.deep.property('locations[0].type', address.type);
          expect(res.body).to.have.deep.property('locations[0].zipcodeDigits', address.zipcode.digits);
        },
        done);
    });

    it('StreetAddress', (done) => {
      const address = {
        type: 'StreetAddress',
        street: 'De Ruijterkade',
        city: 'Amsterdam',
        province: 'Noord-Holland',
      };
      updateAddressAndAssert(
        address,
        (res) => {
          expect(res.body).to.have.deep.property('locations[0].type', address.type);
          expect(res.body).to.have.deep.property('locations[0].cityName', address.city);
          expect(res.body).to.have.deep.property('locations[0].streetName', address.street);
          expect(res.body).to.have.deep.property('locations[0].provinceName', address.province);
        },
        done);
    });

    it('CityAddress', (done) => {
      const address = {
        type: 'CityAddress',
        city: 'Amsterdam',
        municipality: 'Amsterdam',
        province: 'Noord-Holland',
      };
      updateAddressAndAssert(
        address,
        (res) => {
          expect(res.body).to.have.deep.property('locations[0].type', address.type);
          expect(res.body).to.have.deep.property('locations[0].cityName', address.city);
          expect(res.body).to.have.deep.property('locations[0].municipalityName', address.municipality);
          expect(res.body).to.have.deep.property('locations[0].provinceName', address.province);
        },
        done);
    });

    it('MunicipalityAddress', (done) => {
      const address = {
        type: 'MunicipalityAddress',
        municipality: 'Amsterdam',
        province: 'Noord-Holland',
      };
      updateAddressAndAssert(
        address,
        (res) => {
          expect(res.body).to.have.deep.property('locations[0].type', address.type);
          expect(res.body).to.have.deep.property('locations[0].municipalityName', address.municipality);
          expect(res.body).to.have.deep.property('locations[0].provinceName', address.province);
        },
        done);
    });

    it('ProvinceAddress', (done) => {
      const address = {
        type: 'ProvinceAddress',
        province: 'Noord-Holland',
      };
      updateAddressAndAssert(
        address,
        (res) => {
          expect(res.body).to.have.deep.property('locations[0].type', address.type);
          expect(res.body).to.have.deep.property('locations[0].provinceName', address.province);
        },
        done);
    });
  });
});
