import { app, request, expect, getSignedJwt } from '../../../test/test-utils';
import { insertTestData, removeTestData } from '../../../test/seed-utils';
import testUserPlaces from '../../../test/seeds/user_places';

describe('Set email notification', () => {
  let authToken;

  before(() => insertTestData());
  after(() => removeTestData());

  before(() => getSignedJwt({
    sub: testUserPlaces[0].user_id,
    placeId: testUserPlaces[0].place_id,
  }).then(token => {
    authToken = token;
  }));

  it('should set email notification to true', () =>
    request(app)
      .post(`/places/${testUserPlaces[0].place_id}/email-notification`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ enabled: true })
      .expect(200)
      .expect(res => expect(res.body.email_notifications_enabled).to.equal(true))
  );

  it('should set email notification to false', () =>
    request(app)
      .post(`/places/${testUserPlaces[0].place_id}/email-notification`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ enabled: false })
      .expect(200)
      .expect(res => expect(res.body.email_notifications_enabled).to.equal(false))
  );

  it('should fail when no value set', () =>
    request(app)
      .post(`/places/${testUserPlaces[0].place_id}/email-notification`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send()
      .expect(400)
  );
});
