import { app, expect, request } from '../../../test/test-utils';
import cardsData from '../../../test/seeds/cards';

const cardId = cardsData[0].id;

describe('GET /cards/:id', () => {
  it('should exist', () =>
    request(app)
      .get(`/cards/${cardId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body.id).to.equal(cardId))
      .expect(res => expect(res.body).to.have.deep.property('locations[0].geometry.coordinates'))
      .expect(res => expect(res.body).to.not.have.deep.property('locations[0].id'))
  );

  it('should contain a hydrated service', () =>
    request(app)
      .get(`/cards/${cardId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.not.have.property('serviceId'))
      .expect(res => expect(res.body).to.have.property('service'))
      .expect(res => expect(res.body).to.have.deep.property('service.id'))
  );

  it('should contain a hydrated author', () =>
    request(app)
      .get(`/cards/${cardId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.not.have.property('authorId'))
      .expect(res => expect(res.body).to.have.property('author'))
  );

  it('should contain a hydrated publisher', () =>
    request(app)
      .get(`/cards/${cardId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.not.have.property('publisherId'))
      .expect(res => expect(res.body).to.have.property('publisher'))
      .expect(res => expect(res.body).to.have.deep.property('publisher.images'))
  );
});
