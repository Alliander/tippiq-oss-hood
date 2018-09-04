import { app, expect, request } from '../../../test/test-utils';

describe('Get config', () => {
  it('should exist', () =>
    request(app)
      .get('/config')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        expect(res.body).to.have.property('tippiqIdBaseUrl');
        expect(res.body).to.have.property('frontendBaseUrl');
      })
  );
});

