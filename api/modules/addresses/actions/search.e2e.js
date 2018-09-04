import { app, expect, request } from '../../../test/test-utils';

describe('Address search', () => {
  it('should exist', () =>
    request(app)
      .get('/addresses/search?query=ams')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        expect(res.body[0]).to.have.property('geometry');
        expect(res.body[0]).to.have.property('type', 'HouseAddress');
      })
  );
  it('should return a timeout error for a slow query', () =>
    request(app)
      .get('/addresses/search?query=slow')
      .set('Accept', 'application/json')
      .expect(504)
  );
});

