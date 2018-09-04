import { app, expect, request } from '../../../test/test-utils';
import { geoJSONHouseAddress } from '../../../common/geojson-utils';
import { knex } from '../../../common/bookshelf';

// todo: run seeds globally, no inserts here, it will affect other tests.
before(() =>
  knex('card_tag').insert([{
    card: '00000000-0000-0000-0000-000000000010',
    tag: '91d06a42-5609-11e5-95fc-eb8758b3ab9c',
  }]));

after(() =>
  knex('card_tag').where(
    {
      card: '00000000-0000-0000-0000-000000000010',
      tag: '91d06a42-5609-11e5-95fc-eb8758b3ab9c',
    }
  ).del());

describe('POST /cards/search', () => {
  it('should exist', () =>
    request(app)
      .post('/cards/search?sort=distance')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
  );

  it('should fail if no geometry data is provided', () =>
    request(app)
      .post('/cards/search')
      .set('Accept', 'application/json')
      .expect(400)
  );

  it('should include the tags with the cards', () =>
    request(app)
      .post('/cards/search')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
      .expect(res => res.body.every(card => expect(card).to.have.property('tags')))
  );

  it('should include the service with the cards', () =>
    request(app)
      .post('/cards/search')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
      .expect(res => res.body.every(card => expect(card).to.have.property('service')))
      .expect(res => res.body.every(card => expect(card).to.have.deep.property('service.name')))
      .expect(res => res.body.every(card => expect(card).to.have.deep.property('service.category')))
  );

  it('should not include the locations with the cards', () =>
    request(app)
      .post('/cards/search')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body[0]).not.to.have.property('locations'))
      .expect(res => expect(res.body[0]).not.to.have.deep.property('locations[0].distance'))
  );

  it('should include a single distance property for every card', () =>
    request(app)
      .post('/cards/search')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body[0]).to.have.property('distance'))
  );

  it('should filter on 1 tag', () =>
    request(app)
      .post('/cards/search?tag=Duurzaamheid')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(2))
  );

  it('should filter on multiple tags', () =>
    request(app)
      .post('/cards/search?tag=Duurzaamheid&tag=Meldingen')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(3))
  );

  it('should sort by standard, and filter by tag', () =>
    request(app)
      .post('/cards/search?sort=standard&tag=Duurzaamheid')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(2))
  );

  it('should sort by new, and filter by tag', () =>
    request(app)
      .post('/cards/search?sort=new&tag=Duurzaamheid')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(2))
  );

  it('should sort by distance, and filter by tag', () =>
    request(app)
      .post('/cards/search?sort=distance&tag=Duurzaamheid')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(2))
  );

  it('should sort by diversify, and filter by tag', () =>
    request(app)
      .post('/cards/search?sort=diversify&tag=Duurzaamheid')
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(2))
    );
});
