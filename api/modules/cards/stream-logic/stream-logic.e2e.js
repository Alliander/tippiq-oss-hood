
import { app, expect, request } from '../../../test/test-utils';
import { geoJSONHouseAddress } from '../../../common/geojson-utils';
// var BPromise = require('bluebird');
// var _ = require('lodash');
// var moment = require('moment');
// var cartesianProduct = require('cartesian-product');
// var specUtils = require('../../test/spec-utils');
// var ServiceRepository = require('../services/service-repository');
// var UserServicePreferenceRepository =
//   require('../user-service-preferences/user-service-preference-repository');
// var CardRepository = require('../cards/card-repository');

// const userId = '48181aa2-560a-11e5-a1d5-c7050c4109ab';
/* const serviceId = '00000000-0000-0000-0000-000000000000';
const otherServiceId = '00000000-0000-0000-0001-000000000000';
const organizationId = '54e0be2e-560a-11e5-9f4d-039a76ea6f5c'; */

const getCardIndex = (arr, key, value) => arr.findIndex(element => element[key] === value);
const cardIndex = {
  far: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000003'),
  near: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000002'),
  nearest: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000001'),
  otherService: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000001'),
  newest: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000010'),
  new: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000020'),
  old: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000030'),
  future: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000100'),
  disabled: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000013'),
  expired: res => getCardIndex(res.body, 'id', '00000000-0000-0000-0000-000000000200'),
};

describe('StreamLogic', () => {
  /* let authToken;

   before(() => getSignedJwt({ sub: userId }).then(token => {
     authToken = token;
   })); */

  it('should allow the card stream to be sorted on distance', () =>
    request(app)
      .post('/cards/search')
      .query({ sort: 'distance' })
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(2))
      .expect(res => expect(res.body).to.contain.one.with.property('id',
        '00000000-0000-0000-0000-000000000001'))
      .expect(res => expect(res.body).to.contain.one.with.property('id',
        '00000000-0000-0000-0000-000000000002'))
      .expect(res => expect(res.body).to.contain.one.with.property('id',
        '00000000-0000-0000-0000-000000000003'))
      .expect(res => expect(cardIndex.nearest(res)).to.not.equal(null))
      .expect(res => expect(cardIndex.near(res)).to.not.equal(null))
      .expect(res => expect(cardIndex.far(res)).to.not.equal(null))
      .expect(res => expect(cardIndex.far(res)).to.be.above(cardIndex.near(res)))
      .expect(res => expect(cardIndex.near(res)).to.be.above(cardIndex.nearest(res)))
  );

  it('should allow the card stream to be sorted on newest cards first', () =>
    request(app)
      .post('/cards/search')
      .query({ sort: 'new' })
      .send({ geometry: geoJSONHouseAddress })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(2))
      .expect(res => expect(cardIndex.newest(res)).to.not.equal(null))
      .expect(res => expect(cardIndex.new(res)).to.not.equal(null))
      .expect(res => expect(cardIndex.old(res)).to.not.equal(null))
      .expect(res => expect(cardIndex.old(res)).to.be.above(cardIndex.new(res)))
      .expect(res => expect(cardIndex.new(res)).to.be.above(cardIndex.newest(res)))
  );
});
