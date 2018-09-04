import { app, request, expect, getSignedJwt } from '../../../test/test-utils';
import { insertTestData, removeTestData } from '../../../test/seed-utils';
import testUserPlaces from '../../../test/seeds/user_places';
import testUsers from '../../../test/seeds/users';

describe('Get Location', () => {
  let authToken;

  before(() => insertTestData());
  after(() => removeTestData());

  before(() => getSignedJwt({ sub: testUsers[0].id, placeId: testUserPlaces[0].id }).then(token => {
    authToken = token;
  }));

  describe('without token', () => {
    it('should contain a placePolicyUrl', () =>
      request(app)
        .get(`/places/${testUserPlaces[0].place_id}/location`)
        .set('Accept', 'application/json')
        .send()
        .expect(200)
        .expect(res => expect(res.body.placePolicyUrl).to.be.not.empty)
    );
  });

  it('should return new geometry from places', () =>
    request(app)
      .get(`/places/${testUserPlaces[0].place_id}/location`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send()
      .expect(200)
      .expect(res => expect(res.body.location.geometry).to.have.property('coordinates'))
  );

  it('should return geometry from cache (database)', () =>
    request(app)
      .get(`/places/${testUserPlaces[1].place_id}/location`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send()
      .expect(200)
      .expect(res => expect(res.body.location.geometry).to.have.property('coordinates'))
  );

  it('should return geometry from places when cached location is expired', () =>
    request(app)
      .get(`/places/${testUserPlaces[2].place_id}/location`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send()
      .expect(200)
      .expect(res => expect(res.body.location.geometry).to.equal('Location from Tippiq Places'))
  );
});
