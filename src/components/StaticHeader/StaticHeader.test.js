import React from 'react';
import renderer from 'react-test-renderer';
import Element from './index';

jest.mock('../../piwik', () => ({
  push: jest.fn(),
}));

test('Renders', () => {
  const component = renderer.create(
    <Element />
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

