import React from 'react';
import renderer from 'react-test-renderer';
import { SocialCard } from './SocialCard';

jest.mock('../../piwik', () => ({
  push: jest.fn(),
}));

jest.mock('../Header/Header.js',
  () => jest.fn(() => <div />));
jest.mock('../../components/StaticHeader/index.js',
  () => jest.fn(() => <div />));

// https://github.com/reactjs/redux/issues/588 (recommended method below)
// http://ericnish.io/blog/how-to-unit-test-react-redux-components/

test('Renders', () => {
  // This is where we create a mock state/props
  const props = {
    cards: {
      item: [],
    },
    getCard: () => {},
    params: {
      id: '00000000-0000-0000-0000-000000000010',
    },
  };

  const component = renderer.create(
    <SocialCard {...props} />
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
