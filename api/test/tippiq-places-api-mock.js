import nock from 'nock';
import config from '../config';

/**
 * Get the location attribute
 * @function mockGetLocationByAddressType
 * @param {string} baseUrl The base url to use in the tests
 * @returns {undefined}
 */
function mockGetLocationByAddressType(baseUrl) {
  nock(baseUrl)
    .persist() // catch all subsequent requests
    .post('/api/oauth2/token', {
      grant_type: 'authorization_code',
      code: undefined,
      client_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    })
    .reply(() => [200, { access_token: 'exchanged_access_token' }]);

  nock(baseUrl)
    .persist() // catch all subsequent requests
    .get(`/api/places/00000000-0000-0000-0000-000000000000/attributes?type=${config.locationAttributeType}`)
    .reply(() => [200, [{
      data: {
        geometry: { type: 'Point', coordinates: [5.42603954175575, 52.1929127340295] },
        type: config.locationAttributeType,
      },
    }]]);

  nock(baseUrl)
    .persist() // catch all subsequent requests
    .get(`/api/places/00000000-0000-0000-0000-000000000002/attributes?type=${config.locationAttributeType}`)
    .reply(() => [200, [{
      data: {
        geometry: 'Location from Tippiq Places',
        type: config.locationAttributeType,
      },
    }]]);

  nock(baseUrl)
    .persist() // catch all subsequent requests
    .get(`/api/places/12341aa2-560a-11e5-a1d5-c7050c412345/attributes?type=${config.locationAttributeType}`)
    .reply(() => [200, [{
      data: {
        geometry: 'Location from Tippiq Places',
        type: config.locationAttributeType,
      },
    }]]);
}

/**
 * Simulate the email service
 * @function mockSendEmail
 * @param {string} baseUrl The base url to use in the tests
 * @returns {undefined}
 */
function mockSendEmail(baseUrl) {
  nock(baseUrl)
    .persist() // catch all subsequent requests
    .post('/api/places/00000000-0000-0000-0000-000000000000/users/48181aa2-560a-11e5-a1d5-c7050c4109ab/messages/rendered-email', {
    })
    .reply(() => [200]);
}

/**
 * Interceptor for mock services
 * @param {string} baseUrl The base url
 * @returns {object} Mock object
 */
export default function intercept(baseUrl) {
  mockGetLocationByAddressType(baseUrl);
  mockSendEmail(baseUrl);
}
