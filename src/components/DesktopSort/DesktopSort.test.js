import React from 'react';
import renderer from 'react-test-renderer';

import Element from './index';

beforeEach(() => jest.resetModules());

xtest('Renders', () => {
  const component = renderer.create(
    <Element />
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
