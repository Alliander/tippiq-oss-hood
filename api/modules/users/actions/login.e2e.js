import { app, request, getSignedJwt } from '../../../test/test-utils';
import testUsers from '../../../test/seeds/users';
import testPlaces from '../../../test/seeds/places';
import { UserPlaceRepository } from '../../places/repositories';
import config from '../../../config';
import { ACTIONS } from '../../../modules/auth';

const API_USERS_LOGIN_URL = '/users/login';

describe('Login', () => {
  let authToken;
  let authTokenHood;

  before(() => getSignedJwt({ sub: testUsers[1].id, placeId: testPlaces[0].id }).then(token => {
    authToken = token;
  }));

  before(() => getSignedJwt(
    {
      sub: testUsers[1].id,
      placeId: testPlaces[0].id,
      action: ACTIONS.LOGIN_SESSION,
    },
    { issuer: config.jwtIssuer },
    config.tippiqHoodPrivateKey
  ).then(token => {
    authTokenHood = token;
  }));

  after(() =>
    UserPlaceRepository
      .findOne({ place_id: testPlaces[0].id })
      .then(record => record.destroy())
  );

  it('should fail', () =>
    request(app)
      .post(API_USERS_LOGIN_URL)
      .send({ token: 'bla' })
      .expect(403)
  );

  it('should succeed with tippiq id token', () =>
    request(app)
      .post(API_USERS_LOGIN_URL)
      .send({ token: authToken, accessToken: 'sometoken' })
      .expect(200)
  );

  it('should succeed with tippiq hood token', () =>
    request(app)
      .post(API_USERS_LOGIN_URL)
      .send({ token: authTokenHood, accessToken: 'sometoken' })
      .expect(200)
  );
});
