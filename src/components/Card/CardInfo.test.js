import React from 'react';
import renderer from 'react-test-renderer';
import Element from './CardInfo';

test('Renders', () => {
  const component = renderer.create(
    <Element><div>x</div></Element>
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

