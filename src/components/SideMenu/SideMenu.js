/**
 * SideMenu component.
 * @module components/SideMenu
 */

import React from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import styles from './SideMenu.css';

const SideMenu = () => {
  const menuItems = [
    {
      to: '/over-tippiq',
      title: 'Over Tippiq',
      isIndex: false,
    },
    {
      to: '/partners',
      title: 'Partners',
      isIndex: true,
    },
    {
      to: '/partners/partner-worden',
      title: 'Partner worden?',
      isSubMenu: true,
    },
    {
      to: '/privacy',
      title: 'Privacy &amp; Disclaimer',
    },
    {
      to: '/contact',
      title: 'Contact',
    },
  ];

  /* eslint-disable react/no-danger */
  return (
    <div>
      <Nav stacked className={`${styles.sideMenu} hidden-xs`}>
        {menuItems.map(({ to, title, isIndex, isSubMenu }, index) => {
          const item = (
            <NavItem eventKey={1 + ((index + 1) / 10)} className={isSubMenu && styles.subMenu}>
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </NavItem>
          );

          return (
            isIndex ?
              <IndexLinkContainer to={to} key={index}>
                {item}
              </IndexLinkContainer> :
              <LinkContainer to={to} key={index}>
                {item}
              </LinkContainer>
          );
        }
        )}
      </Nav>

      <NavDropdown
        className={`${styles.sideMenuMobile} visible-xs nav-dropdown`}
        componentClass="li"
        title="Navigatie"
        id="menu-nav-dropdown"
      >
        {menuItems.map(({ to, title, isIndex, isSubMenu }, index) => {
          const item = (
            <MenuItem eventKey={1 + ((index + 1) / 10)} className={isSubMenu && styles.subMenu}>
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </MenuItem>
          );

          return (
            isIndex ?
              <IndexLinkContainer to={to} key={index}>
                {item}
              </IndexLinkContainer> :
              <LinkContainer to={to} key={index}>
                {item}
              </LinkContainer>
          );
        }
        )}
      </NavDropdown>
    </div>
  );
  /* eslint-enable react/no-danger */
};

export default SideMenu;
