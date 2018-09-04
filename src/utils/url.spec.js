import { expect } from 'chai';

import { getQueryParam, setQueryParam } from './url';

describe('get query param', () => {
  it('should return the query parameter', () => {
    expect(getQueryParam('?foo=bar', 'foo')).to.equal('bar');
  });

  it('should decode urls', () => {
    expect(getQueryParam('?foo=http%3A%2F%2Ftest.com', 'foo')).to.equal('http://test.com');
  });

  it('should work with full urls', () => {
    expect(getQueryParam('http://test.com/?foo=http%3A%2F%2Ftest.com', 'foo')).to.equal('http://test.com');
  });

  it('should return undefined when an unvalid param is requested', () => {
    expect(getQueryParam('?foo=bar', 'test')).to.be.an('undefined');
  });

  it('should return undefined when url has no params', () => {
    expect(getQueryParam('http://test.com', 'foo')).to.be.an('undefined');
  });
});

describe('set query param', () => {
  it('should set the query parameter', () => {
    expect(setQueryParam('?foo=bar', 'baz', 'qux')).to.equal('?baz=qux&foo=bar');
  });

  it('should work with a full url', () => {
    expect(setQueryParam('http://test.com?foo=bar', 'baz', 'qux')).to.equal('http://test.com?baz=qux&foo=bar');
  });

  it('should work with a url without query params', () => {
    expect(setQueryParam('http://test.com', 'baz', 'qux')).to.equal('http://test.com?baz=qux');
  });
});
