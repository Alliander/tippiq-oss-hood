/**
 * Footer component.
 * @module components/Footer
 */

import React from 'react';
import { Navbar, Dropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import styles from './Footer.css';

/**
 * Footer component class.
 * @function Footer
 * @returns {string} Markup of the component.
 */
const Footer = () =>
  <div className={`container-fluid footer ${styles.footer}`}>
    <div className="hidden-xs">
      <Link to="/over-tippiq" className={styles.link}>Over Tippiq Buurt</Link>
      <Link to="/partners" className={styles.link}>Partners</Link>
      <Link to="/privacy" className={styles.link}>Privacy &amp; Disclaimer</Link>
      <Link to="/contact" className={styles.link}>Contact</Link>
    </div>

    <div className={styles.socialLinks}>
      <a href="https://www.facebook.com/Tippiq-1430219107214646" className={styles.social}><i className="fa fa-facebook" /></a>
      <a href="https://twitter.com/tippiq" className={styles.social}><i className="fa fa-twitter" /></a>
    </div>
    <div className={styles.copyright}>Copyright &copy; 2017 Alliander N.V.</div>

    <Navbar className={`visible-xs ${styles.footerMenu}`}>
      <div className="nav navbar-nav">
        <Dropdown
          className="visible-xs"
          componentClass="li"
          id="footer"
        >
          <Dropdown.Toggle
            onClick={() => (setTimeout(() => (window.scrollTo(0, document.body.scrollHeight)), 0))}
            useAnchor
          >
            Meer over Tippiq
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <LinkContainer to="/over-tippiq">
              <MenuItem eventKey="5.1">Over Tippiq Buurt</MenuItem>
            </LinkContainer>
            <IndexLinkContainer to="/partners">
              <MenuItem eventKey="5.2">Partners</MenuItem>
            </IndexLinkContainer>
            <LinkContainer to="/privacy">
              <MenuItem eventKey="5.3">Privacy &amp; Disclaimer</MenuItem>
            </LinkContainer>
            <LinkContainer to="/contact">
              <MenuItem eventKey="5.4">Contact</MenuItem>
            </LinkContainer>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  </div>;

export default Footer;
