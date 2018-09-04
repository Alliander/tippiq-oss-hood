import React from 'react';
import renderer from 'react-test-renderer';
import { Stream } from './Stream';

jest.mock('../../piwik', () => ({
  push: jest.fn(),
}));

jest.mock('react-masonry-component');
jest.mock('../Header/Header.js',
  () => jest.fn(() => <div />));
jest.mock('../ThemeFilter/ThemeFilter.js',
  () => jest.fn(() => <div />));
jest.mock('../ServiceFilter/ServiceFilter.js',
  () => jest.fn(() => <div />));
jest.mock('../DesktopSort/DesktopSort.js',
  () => jest.fn(() => <div />));
jest.mock('../MobileSort/MobileSort.js',
  () => jest.fn(() => <div />));

// https://github.com/reactjs/redux/issues/588 (recommended method below)
// http://ericnish.io/blog/how-to-unit-test-react-redux-components/

test('Renders', () => {
  // This is where we create a mock state/props
  const props = {
    cards: {
      items: [],
    },
    placeLocation: {
      location: {},
    },
    userSession: {},
    getCards: () => {},
    getPlaceLocation: () => {},
  };

  const component = renderer.create(
    <Stream {...props} />
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
