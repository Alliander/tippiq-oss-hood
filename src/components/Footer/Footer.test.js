import React from 'react';
import renderer from 'react-test-renderer';
import Element from './index';

test('Renders', () => {
  const component = renderer.create(
    <Element />
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

