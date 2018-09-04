import React from 'react';
import renderer from 'react-test-renderer';
import Element from './FlipCard';

test('Renders', () => {
  const component = renderer.create(
    <Element>
      <div>Front</div>
      <div>Back</div>
    </Element>
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
