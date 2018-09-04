import { expect } from '../test/test-utils';
import { latLonToGeojson } from './geojson-utils';

describe('the GeoJSON utils', () => {
  describe('converting a lat long to a GeoJSON object', () => {
    let output;

    before(() => {
      output = {
        type: 'Point',
        coordinates: [0.42, 42],
      };
    });

    it('should return a valid GeoJSON object', () =>
      expect(latLonToGeojson(42, 0.42)).to.deep.equal(output)
    );

    it('should convert input as strings to floating point numbers', () =>
      expect(latLonToGeojson('42', '0.42')).to.deep.equal(output)
    );
  });
});
