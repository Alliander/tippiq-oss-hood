import React from 'react';
import renderer from 'react-test-renderer';

import Element from './index';

beforeEach(() => jest.resetModules());

xtest('Renders', () => {
  const elem = document.createElement('div');
  elem.setAttribute('id', 'Div1');

  const component = renderer.create(
    <Element
      buttons={[
        {
          icon: 'facebook',
        },
        {
          icon: 'twitter',
        },
        {
          icon: 'whatsapp',
        },
        {
          icon: 'mail',
        },
      ]}
      shareData={{}}
      linkElement={elem}
      popupElement={elem}
    />
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

