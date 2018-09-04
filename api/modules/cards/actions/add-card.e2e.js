import _ from 'lodash';
import BPromise from 'bluebird';
import {
  app,
  expect,
  request,
  endHandler,
  uuidRegexString,
  getSignedJwt,
} from '../../../test/test-utils';
import postCardJsonReq from '../../../test/seeds/valid-card';
import { TagRepository } from '../../tags/repositories';
import { ServiceTagRepository } from '../../services/repositories';
import testUsers from '../../../test/seeds/users';
import { generateStringWithLength } from '../../../common/string-utils';

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

describe('POST /cards', () => { // eslint-disable-line max-statements
  let token;
  let cardUrl;
  let cardUrl2;

  // Only admin user (with role administrator) has permissions.
  before(() => getSignedJwt({ sub: testUsers[0].id }).then(authToken => {
    token = authToken;
  }));

  before('Tag42', () => whiteListTag('tag42', postCardJsonReq.serviceId));
  before('Tag43', () => whiteListTag('tag43', postCardJsonReq.serviceId));
  before('newTag', () => whiteListTag('newTag', postCardJsonReq.serviceId));
  before('valid Tag', () => whiteListTag('valid tag', postCardJsonReq.serviceId));

  afterEach('cleanup test data', () => {
    const deleteCardPromises = [];
    if (cardUrl) {
      deleteCardPromises.push(createDeleteCardRequest(cardUrl, token));
    }

    if (cardUrl2) {
      deleteCardPromises.push(createDeleteCardRequest(cardUrl2, token));
    }

    return Promise
      .all(deleteCardPromises)
      .then(() => {
        cardUrl = null;
        cardUrl2 = null;
      });
  });

  after('Delete white list tags', () => deleteServiceTags(postCardJsonReq.serviceId));

  it('should add a card', () =>
    request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(postCardJsonReq)
      .expect(201)
      .expect('location', new RegExp(`/cards/${uuidRegexString}`))
      .expect(response => {
        cardUrl = response.headers.location;
        return request(app)
          .get(cardUrl)
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.property('externalId',
            postCardJsonReq.externalId))
          .expect(res => expect(res.body).to.have.property('parentId',
            postCardJsonReq.parentId))
          .expect(res => expect(res.body).to.have.property('title',
            postCardJsonReq.title))
          .expect(res => expect(res.body).to.have.property('description',
            postCardJsonReq.description))
          .expect(res => expect(res.body).to.have.property('startDate',
            postCardJsonReq.startDate))
          .expect(res => expect(res.body).to.have.property('endDate',
            postCardJsonReq.endDate))
          .expect(res => expect(res.body).to.have.property('publishedAt',
            postCardJsonReq.publishedAt))
          .expect(res => expect(res.body).to.have.property('expiresAt',
            postCardJsonReq.expiresAt))
          .expect(res => expect(res.body).to.not.have.property('owner'))
          .expect(res => expect(res.body).to.have.property('documentType',
            postCardJsonReq.documentType))
          .expect(res => expect(res.body).to.have.property('document'))
          .expect(res => expect(res.body).to.have.deep.property('document.expectedEndDate',
            postCardJsonReq.document.expectedEndDate))
          .expect(res => expect(res.body).to.have.deep.property('document.involvedCustomers',
            postCardJsonReq.document.involvedCustomers))
          .expect(res => expect(res.body).to.have.deep.property('document.description',
            postCardJsonReq.document.description))
          .expect(res => expect(res.body).to.have.deep.property('document.website',
            postCardJsonReq.document.website))
          .expect(res => expect(res.body).to.have.deep.property('document.storingsnummer',
            postCardJsonReq.document.storingsnummer))
          .expect(res => expect(res.body).to.have.property('images'))
          .expect(res => expect(res.body).to.have.deep.property('images.wide',
            postCardJsonReq.images.wide))
          .expect(res => expect(res.body).to.have.deep.property('images.portrait',
            postCardJsonReq.images.portrait))
          .expect(res => expect(res.body).to.have.deep.property('images.landscape',
            postCardJsonReq.images.landscape))
          .expect(res => expect(res.body).to.have.property('tags'))
          .expect(res => expect(res.body).to.have.deep.property('tags[0].label',
            postCardJsonReq.tags[0]))
          .expect(res => expect(res.body).to.have.property('locations'))
          .expect(res => expect(res.body).to.have.deep.property('locations[0].type',
            postCardJsonReq.locations[0].address.type))
          .expect(res => expect(res.body).to.have.deep.property('author.name'))
          .expect(res => expect(res.body).to.have.deep.property('publisher.name'));
      })
  );

  it('should require authentication', () =>
    request(app)
      .post('/cards')
      .expect(403)
  );

  it('should be idempotent for updates', (done) => {
    request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(postCardJsonReq)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;
      })
      .end(errCard1 => {
        if (errCard1) {
          done(errCard1);
        }
        const requestBody = _.clone(postCardJsonReq);
        // TODO: test changing parentId
        requestBody.title += ' CHANGED';
        requestBody.description += ' CHANGED';
        requestBody.startDate = new Date().toISOString();
        requestBody.endDate = new Date(9999, 3, 31).toISOString();
        requestBody.publishedAt = new Date().toISOString();
        requestBody.expiresAt = new Date(9999, 3, 31).toISOString();
        requestBody.documentType += 'CHANGED';
        requestBody.document = {
          newProperty: 'newValue',
          description: 'new value',
        };
        requestBody.images = {
          newProperty: 'newValue',
          wide: 'new value',
        };
        requestBody.tags = ['newTag'];
        requestBody.locations = [
          {
            address: {
              type: 'CityAddress',
              city: 'Amsterdam',
              municipality: 'Amsterdam',
              province: 'Noord-Holland',
            },
          },
        ];
        request(app)
          .post('/cards')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(requestBody)
          .expect(201)
          .expect(resp => {
            cardUrl2 = resp.headers.location;
          })
          .end(errCard2 => {
            if (errCard2) {
              done(errCard2);
            }
            request(app)
              .get(cardUrl2)
              .set('Accept', 'application/json')
              .expect(200)
              .expect(res => expect(res.body).to.have.property('externalId', requestBody.externalId))
              .expect(res => expect(res.body).to.have.property('parentId', requestBody.parentId))
              .expect(res => expect(res.body).to.have.property('title', requestBody.title))
              .expect(res => expect(res.body).to.have.property('description', requestBody.description))
              .expect(res => expect(res.body).to.have.property('startDate', requestBody.startDate))
              .expect(res => expect(res.body).to.have.property('endDate', requestBody.endDate))
              .expect(res => expect(res.body).to.have.property('publishedAt', requestBody.publishedAt))
              .expect(res => expect(res.body).to.have.property('expiresAt', requestBody.expiresAt))
              .expect(res => expect(res.body).to.not.have.property('owner'))
              .expect(res => expect(res.body).to.have.property('documentType', requestBody.documentType))
              .expect(res => expect(res.body).to.have.property('document'))
              .expect(res => expect(res.body).to.have.deep.property('document.newProperty', requestBody.document.newProperty))
              .expect(res => expect(res.body).to.have.deep.property('document.description', requestBody.document.description))
              .expect(res => expect(res.body).to.not.have.deep.property('document.expectedEndDate'))
              .expect(res => expect(res.body).to.not.have.deep.property('document.involvedCustomers'))
              .expect(res => expect(res.body).to.not.have.deep.property('document.website'))
              .expect(res => expect(res.body).to.not.have.deep.property('document.storingsnummer'))
              .expect(res => expect(res.body).to.have.property('images'))
              .expect(res => expect(res.body).to.have.deep.property('images.newProperty', requestBody.images.newProperty))
              .expect(res => expect(res.body).to.have.deep.property('images.wide', requestBody.images.wide))
              .expect(res => expect(res.body).to.not.have.deep.property('images.portrait'))
              .expect(res => expect(res.body).to.not.have.deep.property('images.landscape'))
              .expect(res => expect(res.body).to.have.property('tags'))
              .expect(res => expect(res.body).to.have.deep.property('tags[0].label', requestBody.tags[0]))
              .expect(res => expect(res.body).to.have.property('locations'))
              .expect(res => expect(res.body).to.have.deep.property('locations[0].type', requestBody.locations[0].address.type))
              .expect(res => expect(res.body).to.have.deep.property('author.name'))
              .expect(res => expect(res.body).to.have.deep.property('publisher.name'))
              .expect(res => expect(res.body).to.have.deep.property('service.name'))
              .expect(res => expect(res.body).to.have.deep.property('service.category'))
              .end(errGetCard2 => {
                if (errGetCard2) {
                  done(errGetCard2);
                }
                done();
              });
          });
      });
  });

  it('should ignore the createdAt and updatedAt properties of the incoming card', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.createdAt = new Date(2000, 1, 1);
    requestBody.updatedAt = new Date(2001, 1, 1);
    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;
        return request(app)
          .get(cardUrl)
          .set('Accept', 'application/json')
          .send()
          .expect(res => expect(res.body.createdAt).to.not.equal(requestBody.createdAt.toJSON()))
          .expect(res => expect(res.body.updatedAt).to.not.equal(requestBody.updatedAt.toJSON()));
      });
  });

  it('should save empty values for the publishedAt and expiresAt propertiess of the incoming' +
    ' object', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = 'publishedAtDefault';
    delete requestBody.publishedAt;
    delete requestBody.expiresAt;

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;

        return request(app)
          .get(cardUrl)
          .set('Accept', 'application/json')
          .send()
          .expect(res => expect(res.body.publishedAt).not.to.be.null)
          .expect(res => expect(res.body.expiresAt).to.be.null);
      });
  });

  it('should not require a parentId when creating a new card', done => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `parentIdNotSet ${Date.now()}`;
    delete requestBody.parentId;
    let cardWithoutParentIdUrl;

    request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardWithoutParentIdUrl = response.headers.location;
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        return request(app)
          .del(cardWithoutParentIdUrl)
          .set('Authorization', `Bearer ${token}`)
          .end(endHandler(done));
      });
  });

  it('should add a card with geojson as location', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.locations = [
      {
        geometry: { type: 'Point', coordinates: [5.14116579999995, 52.2029858] },
      },
    ];

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;
      });
  });

  it('should accept an empty parentId when creating a new card', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `emptyParentId ${Date.now()}`;
    requestBody.parentId = '';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;
      });
  });

  it('should accept a null parentId when creating a new card', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `nullParentId ${Date.now()}`;
    requestBody.parentId = null;

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;
      });
  });

  it('should not create a new card when the serviceId has not been set', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `serviceIdNotSet ${Date.now()}`;
    delete requestBody.serviceId;

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the parentId is not a valid UUID', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `parentIdNotExist ${Date.now()}`;
    requestBody.parentId = 'NotAUUID';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the parentId doesn\'t exist', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `parentIdNotExist ${Date.now()}`;
    requestBody.parentId = '11111111-0000-0000-0000-000000000000';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the externalId is not set', () => {
    const requestBody = _.clone(postCardJsonReq);
    delete requestBody.externalId;

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the externalId is zero characters', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = '';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the externalId is longer than 255 characters', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = generateStringWithLength(256) + Date.now();

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the title is invalid', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `titleInvalid ${Date.now()}`;
    requestBody.title = generateStringWithLength(501);

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the description is invalid', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `descriptionInvalid ${Date.now()}`;
    requestBody.description = generateStringWithLength(5001);

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when locations is null', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `noLocations ${Date.now()}`;
    requestBody.locations = null;

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when no locations are specified', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `noLocations ${Date.now()}`;
    requestBody.locations = [];

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when a location has neither an address or a geometry specified', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidLocation ${Date.now()}`;
    requestBody.locations = [
      {
        address: {
          type: 'ZipcodeAddress',
          digits: '1032',
          chars: 'KL',
        },
      },
      {},
    ];

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should add valid tags to the card', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.tags = ['tag43', 'valid tag'];

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;

        return request(app)
          .get(cardUrl)
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.property('tags'))
          .expect(res => expect(res.body.tags).to.contain.one.with.property('label', 'tag43'))
          .expect(res => expect(res.body.tags).to.contain.one.with.property('label', 'valid tag'));
      });
  });

  it('should add valid images to the card', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.images = {
      badge: 'https://www.tippiq.nl/image_badge.jpg',
      full: 'https://www.tippiq.nl/image_full.jpg',
    };

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;

        return request(app)
          .get(cardUrl)
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.property('images'))
          .expect(res => expect(res.body.images).to.have.property('badge', 'https://www.tippiq.nl/image_badge.jpg'))
          .expect(res => expect(res.body.images).to.have.property('full', 'https://www.tippiq.nl/image_full.jpg'));
      });
  });

  it('should add a card with an empty images map', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.images = {};

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;

        return request(app)
          .get(cardUrl)
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.property('images'));
      });
  });

  it('should not create a new card when the images property is null', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `images null ${Date.now()}`;
    requestBody.images = null;

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the images map contains a key that is 1 character long',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidImages ${Date.now()}`;
      requestBody.images = {
        a: 'https://www.tippiq.nl/image_badge.jpg',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the images map contains a key that consists of numbers',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidImages ${Date.now()}`;
      requestBody.images = {
        1111: 'https://www.tippiq.nl/image_badge.jpg',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the images map contains a key that has a dash in it',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidImages ${Date.now()}`;
      requestBody.images = {
        'using-dash': 'https://www.tippiq.nl/image_badge.jpg',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the images map contains a key that starts with uppercase',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidImages ${Date.now()}`;
      requestBody.images = {
        Uppercase: 'https://www.tippiq.nl/image_badge.jpg',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the images map contains a key with no value', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidImages ${Date.now()}`;
    requestBody.images = {
      withoutValue: null,
    };

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the images map contains a key with an empty string', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidImages ${Date.now()}`;
    requestBody.images = {
      withoutValue: '',
    };

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the images map contains an invalid and a valid property',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidImages ${Date.now()}`;
      requestBody.images = {
        valid: 'https://www.tippiq.nl/image_badge.jpg',
        'an-invalid-key': 'https://www.tippiq.nl/image_badge.jpg',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the startDate > endDate (if they are set)', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidStartEndDates ${Date.now()}`;
    requestBody.startDate = '2015-08-10T09:42:14.000Z';
    requestBody.endDate = '2015-08-09T09:42:14.000Z';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the publishedAt > expiresAt (if they are set)', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidPubExpDates ${Date.now()}`;
    requestBody.publishedAt = '2015-08-10T09:42:14.000Z';
    requestBody.expiresAt = '2015-08-09T09:42:14.000Z';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the authorId is not a valid UUID', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidAuthorId ${Date.now()}`;
    requestBody.authorId = 'NonExistingAuthor';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the authorId doesn\'t exist', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidAuthorId ${Date.now()}`;
    requestBody.authorId = '11111111-0000-0000-0000-000000000000';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the publisherId is not a valid UUID', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidPublisherId ${Date.now()}`;
    requestBody.publisherId = 'NonExistingPublisher';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the publisherId doesn\'t exist', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `publisherDoesntExist ${Date.now()}`;
    requestBody.publisherId = '11111111-0000-0000-0000-000000000000';

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the documentType is invalid', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidDocumentType ${Date.now()}`;
    requestBody.documentType = generateStringWithLength(61);

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should add valid document properties to the card', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = 'validDocument';
    requestBody.document = {
      aValidProperty: 'AMostSensibleValue',
    };

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect(response => {
        cardUrl = response.headers.location;

        return request(app)
          .get(cardUrl)
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.property('document'))
          .expect(res => expect(res.body.document).to.have.property('aValidProperty', 'AMostSensibleValue'));
      });
  });

  it('should not create a new card when the document is null', () => {
    const requestBody = _.clone(postCardJsonReq);
    requestBody.externalId = `invalidDocument ${Date.now()}`;
    requestBody.document = null;

    return request(app)
      .post('/cards')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400);
  });

  it('should not create a new card when the document contains a property that is 1 character long',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidDocument ${Date.now()}`;
      requestBody.document = {
        a: 'bob',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the document contains a property that consists of numbers',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidDocument ${Date.now()}`;
      requestBody.document = {
        1111: 31,
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the document contains a property that has a dash in it',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidDocument ${Date.now()}`;
      requestBody.document = {
        'using-dash': true,
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the document contains a property that starts with uppercase',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidDocument ${Date.now()}`;
      requestBody.document = {
        Uppercase: 'not allowed',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the document contains an invalid and a valid property',
    () => {
      const requestBody = _.clone(postCardJsonReq);
      requestBody.externalId = `invalidDocument ${Date.now()}`;
      requestBody.document = {
        valid: 'valid',
        a: 'bob',
      };

      return request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400);
    });

  it('should not create a new card when the specified tag is not added to the service whitelist',
    () => {
      const newTagLabel = `new-tag-${Date.now()}`;
      const requestBody = _.clone(postCardJsonReq);
      requestBody.tags = [newTagLabel];

      return createTag(newTagLabel)
        .then(() =>
          request(app)
            .post('/cards')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(requestBody)
            .expect(400)
            .expect(() => TagRepository
              .findByLabel(newTagLabel)
              .then(tag => TagRepository.deleteById(tag.get('id'))))
        );
    });
});
