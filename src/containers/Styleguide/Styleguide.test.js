import React from 'react';
import renderer from 'react-test-renderer';

import Styleguide from './Styleguide';

jest.mock('../../piwik', () => ({
  push: jest.fn(),
}));

beforeEach(() => jest.resetModules());

xtest('Renders', () => {
  const component = renderer.create(
    <Styleguide />
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
