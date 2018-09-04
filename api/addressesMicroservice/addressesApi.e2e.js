import { TimeoutError } from 'bluebird';
import {
  getLocationByAddressType,
  search,
} from './addressesApi';
import { LocationRepository } from '../modules/locations/repositories';
import { expect } from '../test/test-utils';

describe('POST find-by-address-type', () => {
  it('should return location for zipcode address', () =>
    getLocationByAddressType({
      address: {
        type: 'ZipcodeAddress',
        zipcode: {
          digits: '1011',
          chars: 'AB',
        },
      },
    })
      .then(location => LocationRepository.create(location))
  );
});

describe('search', () => {
  it('should return address suggestions based on a query string', () => Promise.all([
    expect(search('ams')).to.eventually.be.an('array'),
  ]));

  it('should an throw an error when a slow query is submitted', () => Promise.all([
    expect(search('slow')).to.be.rejectedWith(TimeoutError),
  ]));
});
