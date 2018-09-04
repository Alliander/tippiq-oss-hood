import { app, request, getSignedJwt } from '../../../test/test-utils';
import { insertTestData, removeTestData } from '../../../test/seed-utils';
import testUserPlaces from '../../../test/seeds/user_places';

describe('Send first email notification', () => {
  let authToken;

  before(() => insertTestData());
  after(() => removeTestData());

  before(() => getSignedJwt({
    sub: testUserPlaces[0].user_id,
    placeId: testUserPlaces[0].place_id,
  }).then(token => {
    authToken = token;
  }));

  it('should not send if not authorized', () =>
    request(app)
      .get(`/send-weekly-newsletter/placeId/${testUserPlaces[0].place_id}/send-first-newsletter`)
      .set('Accept', 'application/json')
      .expect(403)
  );

  it('should not send if user does not match the place id', () =>
    request(app)
      .get('/send-weekly-newsletter/placeId/5eb58348-f3cb-11e6-9298-cb59bf0df167/send-first-newsletter')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  );

  it('should succeed if mail is verified for the first time', () =>
    request(app)
      .get(`/send-weekly-newsletter/placeId/${testUserPlaces[0].place_id}/send-first-newsletter`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)
  );

  it('should fail if newsletter is already sent', () =>
    request(app)
      .get(`/send-weekly-newsletter/placeId/${testUserPlaces[0].place_id}/send-first-newsletter`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  );
});
