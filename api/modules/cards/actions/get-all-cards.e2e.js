/* eslint-disable max-nested-callbacks */

import { app, expect, request } from '../../../test/test-utils';

describe('GET /cards', () => {
  it('should exist', () =>
    request(app)
      .get('/cards')
      .set('Accept', 'application/json')
      .expect(res => expect(res.body).to.have.length.of(22))
      .expect(200)
  );

  describe('filtering the results', () => {
    it('should be able to filter by 1 tag', () =>
      request(app)
        .get('/cards?tag=Duurzaamheid')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(3))
    );

    it('should be able to filter by multiple tags', () =>
      request(app)
        .get('/cards?tag=Duurzaamheid&tag=Meldingen')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(4))
    );

    it('should be able to filter by category', () =>
      request(app)
        .get('/cards?category=Alerts')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(1))
    );

    it('should be able to filter by multiple categories', () =>
      request(app)
        .get('/cards?category=Alerts&category=test')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(11))
    );

    it('should filter by multiple service_ids', () =>
      request(app)
        .get('/cards?service=00000000-0000-0000-0000-000000000000&service=00000000-0000-0000-0001-000000000000')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(10))
    );

    it('should filter by category and service_ids', () =>
      request(app)
        .get('/cards?category=test&service=00000000-0000-0000-0000-000000000000&service=00000000-0000-0000-0001-000000000000')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(9))
    );

    it('should be able to filter by externalId', () =>
      request(app)
        .get('/cards?externalId=Tippiq')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(1))
        .expect(res => expect(res.body[0]).to.have.property('id',
          '00000000-0000-0000-0000-000000000000'))
    );

    it('should be able to filter by serviceId', () =>
      request(app)
        .get('/cards?serviceId=00000000-0000-0000-0001-000000000000')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(1))
        .expect(res => expect(res.body[0].service).to.have.property('name',
          'Service voor tests 2... niet weggooien'))
    );

    it('should be able to filter by authorId', () =>
      request(app)
        .get('/cards?authorId=54e0be2e-560a-11e5-9f4d-039a76ea6f5c')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(22))
        .expect(res => expect(res.body[0].author).to.have.property('name', 'Tippiq'))
    );

    it('should be able to filter by publisherId', () =>
      request(app)
        .get('/cards?publisherId=54e0be2e-560a-11e5-9f4d-039a76ea6f5c')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => expect(res.body).to.have.length.of(22))
        .expect(res => expect(res.body[0].publisher).to.have.property('name', 'Tippiq'))
    );

    describe('by title', () => {
      it('should exist', () =>
        request(app)
          .get('/cards?title=Expired Card')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id', '00000000-0000-0000-0000-000000000200'))
      );

      it('should be case insensitive', () =>
        request(app)
          .get('/cards?title=expIREd cARd')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000200'))
      );

      it('should include the cards of which at lease a part of the title matches', () =>
        request(app)
          .get('/cards?title=Expi')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000200'))
      );
    });

    describe('by description', () => {
      it('should exist', () =>
        request(app)
          .get('/cards?description=OldCard')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000030'))
      );

      it('should be case insensitive', () =>
        request(app)
          .get('/cards?description=oldcard')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000030'))
      );

      it('should include the cards of which at least a part of the description matches', () =>
        request(app)
          .get('/cards?description=card')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(10))
      );
    });

    describe('by startDate', () => {
      it('should allow filtering between two dates', () =>
        request(app)
          .get('/cards?startDate=2015-11-30T00:00:00Z...2015-12-06T00:00:00Z')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000000'))
      );

      it('should allow filtering cards from a specific date', () =>
        request(app)
          .get('/cards?startDate=2015-11-30T00:00:00Z')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(8))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000000'))
      );

      it('should allow filtering cards until a specific date', () =>
        request(app)
          .get('/cards?startDate=...2015-12-31T00:00:00Z')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(2))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000000'))
      );
    });

    describe('by endDate', () => {
      it('should allow filtering between two dates', () =>
        request(app)
          .get('/cards?endDate=2015-11-30T00:00:00Z...2015-12-06T00:00:00Z')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000000'))
      );

      it('should allow filtering cards from a specific date', () =>
        request(app)
          .get('/cards?endDate=2015-11-30T00:00:00Z')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(6))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000000'))
      );

      it('should allow filtering cards until a specific date', () =>
        request(app)
          .get('/cards?endDate=...2015-12-31T00:00:00Z')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of(1))
          .expect(res => expect(res.body[0]).to.have.property('id',
            '00000000-0000-0000-0000-000000000000'))
      );

      describe('by publishedAt', () => {
        it('should allow filtering between two dates', () =>
          request(app)
            .get('/cards?publishedAt=1000-01-01T00:00:00Z...1500-12-31T00:00:00Z')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(8))
        );

        it('should allow filtering cards from a specific date', () =>
          request(app)
            .get('/cards?publishedAt=2000-08-01T00:00:00Z')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(14))
        );

        it('should allow filtering cards until a specific date', () =>
          request(app)
            .get('/cards?publishedAt=...2000-12-31T00:00:00Z')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(9))
        );
      });

      describe('by expiresAt', () => {
        it('should allow filtering between two dates', () =>
          request(app)
            .get('/cards?expiresAt=2015-12-04T00:00:00Z...2015-12-05 01:00:00Z')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(1))
            .expect(res => expect(res.body[0]).to.have.property('id',
              '00000000-0000-0000-0000-000000000000'))
        );

        it('should allow filtering cards from a specific date', () =>
          request(app)
            .get('/cards?expiresAt=2000-08-01T00:00:00Z')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(11))
        );

        it('should allow filtering cards until a specific date', () =>
          request(app)
            .get('/cards?expiresAt=...2015-01-31T00:00:00Z')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(1))
        );

        describe('by createdAt', () => {
          it('should allow filtering between two dates', () =>
            request(app)
              .get('/cards?createdAt=2000-01-01T00:00:00Z...2015-12-31T00:00:00Z')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(res => expect(res.body).to.have.length.of(1))
              .expect(res => expect(res.body[0]).to.have.property('id',
                '00000000-0000-0000-0000-000000000000'))
          );

          it('should allow filtering cards from a specific date', () =>
            request(app)
              .get('/cards?createdAt=2016-01-01T00:00:00Z')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(res => expect(res.body).to.have.length.of(21))
          );

          it('should allow filtering cards until a specific date', () =>
            request(app)
              .get('/cards?createdAt=...2015-12-31T00:00:00Z')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(res => expect(res.body).to.have.length.of(1))
          );
        });

        describe('by updatedAt', () => {
          it('should allow filtering between two dates', () =>
            request(app)
              .get('/cards?updatedAt=2000-01-01T00:00:00Z...2015-12-31T00:00:00Z')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(res => expect(res.body).to.have.length.of(1))
              .expect(res => expect(res.body[0]).to.have.property('id',
                '00000000-0000-0000-0000-000000000000'))
          );

          it('should allow filtering cards from a specific date', () =>
            request(app)
              .get('/cards?updatedAt=2016-01-01T00:00:00Z')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(res => expect(res.body).to.have.length.of(21))
          );

          it('should allow filtering cards until a specific date', () =>
            request(app)
              .get('/cards?updatedAt=...2015-12-31T00:00:00Z')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(res => expect(res.body).to.have.length.of(1))
          );
        });
      });

      describe('paging the results', () => {
        it('should allow setting the page and page size', () =>
          request(app)
            .get('/cards?page=1&pageSize=3')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(3))
        );

        it('should have page 0 as the first page', () =>
          request(app)
            .get('/cards?page=0&pageSize=3')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(3))
        );

        it('should be able to search for a page with no results', () =>
          // set the page size to a high number, so all results are part of the first page
          request(app)
            .get('/cards?page=42&pageSize=9999')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(res => expect(res.body).to.have.length.of(0))
        );
      });

      it('should include the tags with the cards', () =>
        request(app)
          .get('/cards')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of.at.least(1))
          .expect(res => res.body.every(card => expect(card).to.have.property('tags')))
      );

      it('should include the service with the cards', () =>
        request(app)
          .get('/cards')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => expect(res.body).to.have.length.of.at.least(1))
          .expect(res => res.body.every(card => expect(card).to.have.property('service')))
          .expect(res => res.body.every(card => expect(card).to.have.deep.property('service.id')))
          .expect(res => res.body.every(card => expect(card).to.have.deep.property('service.name')))
          .expect(res => res.body.every(card => expect(card).to.have.deep.property(
            'service.category')))
      );

      it('should include the locations with the cards', () =>
        request(app)
          .get('/cards')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => res.body.every(card => expect(card).to.have.property('locations')))
      );
    });
  });
});
