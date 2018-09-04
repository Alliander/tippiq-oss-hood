/**
 * NavBar component.
 * @module components/NavBar
 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, Dropdown, MenuItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { truncate } from 'lodash';

import styles from './NavBar.css';
import tippiqBuurtLogo from '../../static/images/buurt.svg';
import homeIcon from '../../static/svgIcons/Home.svg';

import piwik from '../../piwik';

/**
 * NavBar Container component.
 * @function NavBar
 * @returns {string} Markup of the component.
 */
export default class NavBarContainer extends Component {
  static propTypes = {
    logout: PropTypes.func,
    placeTitle: PropTypes.string,
    placeId: PropTypes.string,
    residentName: PropTypes.string,
    loginUrl: PropTypes.string,
    selectPlaceUrl: PropTypes.string,
    myAccountUrl: PropTypes.string,
    loggedIn: PropTypes.bool,
    hideMenu: PropTypes.bool,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.renderDropdownContent = this.renderDropdownContent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.renderDropDownItems = this.renderDropDownItems.bind(this);
    this.renderMenuItems = this.renderMenuItems.bind(this);
    this.selectPlace = this.selectPlace.bind(this);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  /**
   * componentDidMount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  /**
   * ComponentWillUnmount
   * @function componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    if (__CLIENT__) {
      window.removeEventListener('resize', this.updateDimensions);
    }
  }

  /**
   * SelectPlace
   * @function SelectPlace
   * @returns {undefined}
   */
  selectPlace() {
    document.location.href = this.props.selectPlaceUrl;
  }

  /**
   * UpdateDimensions
   * @function UpdateDimensions
   * @returns {undefined}
   */
  updateDimensions() {
    this.setState({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  }

  /**
   * CheckDimensions
   * @function CheckDimensions
   * @returns {undefined}
   */
  checkDimensions() {
    return ({
      width: this.state.width,
      height: this.state.height,
    });
  }

  /**
   * RenderDropdownContent
   * @function renderDropdownContent
   * @param {Bool} visible Properties
   * @returns {string} Markup of the residents screen.
   */
  renderDropdownContent(visible) {
    if (__CLIENT__) {
      const {
        residentName,
        placeTitle,
        // placeId,
      } = this.props;
      // const placeUrl = placeId && `/huis/${placeId}`;

      return (
        <div
          className={`${styles.contentWrapper}
          ${(!visible) && ' hidden-xs hidden-sm'} `}
        >
          <div className={styles.buttonTextHolder}>
            { // placeUrl ? <span className={styles.resident}>Bewoner</span> :
              <span className={styles.residentName}>{residentName}</span>
            }
          </div>
          <span className={styles.placeTitle}>{placeTitle && truncate(placeTitle, { length: 20, separator: '..' })}</span>
        </div>
      );
    }
    return null;
  }

  /**
   * RenderMenuItems
   * @function renderMenuItems
   * @returns {string} Markup of the menuItems
   */
  renderMenuItems() {
    const { loginUrl } = this.props;

    return (
      <Nav className={[styles.navBarBlock, styles.navBarNavigation, 'pull-right']}>
        <LinkContainer
          to="/registreren"
          onClick={
            () =>
              piwik.push(['trackEvent', 'Onboarding', 'Click on register - NavBar'])
            }
        >
          <NavItem className={styles.navBarItem} eventKey={1}>
            <span>Aanmelden</span>
          </NavItem>
        </LinkContainer>
        <NavItem className={styles.navBarButton} eventKey={2} href={loginUrl}>
          <Button>Inloggen</Button>
        </NavItem>
      </Nav>
    );
  }

  /**
   * renderMenuButtons
   * @function renderMenuButtons
   * @returns {string} Markup of the renderMenuButtons
   */
  renderMenuButtons() {
    return (
      <Nav className={[styles.navBarBlock, styles.navBarNavigation]}>
        <LinkContainer to="/mijn-buurt">
          <NavItem className={styles.navBarItem} eventKey={1}>
            <span className="hidden-sm hidden-xs">Mijn buurt</span>
            <span className="visible-xs visible-sm"><span className={styles.iconBuurt} /></span>
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/buurtbericht-beheren">
          <NavItem className={styles.navBarItem} eventKey={2}>
            <span className="hidden-sm hidden-xs">Buurtbericht</span>
            <span className="visible-xs visible-sm"><span className={styles.iconBericht} /></span>
          </NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  /**
   * RenderDropDownItems
   * @function renderDropDownItems
   * @returns {string} Markup of the dropdownItems
   */
  renderDropDownItems() {
    const {
      placeId,
      selectPlaceUrl,
      myAccountUrl,
    } = this.props;

    return (
      <div className={styles.navBarBlock}>
        <Dropdown
          className={styles.navBarDropdown}
          componentClass="li"
          id="basic-nav-dropdown"
        >
          <Dropdown.Toggle className={styles.headerButtonBlock}>
            <div className={styles.horizontal}>
              <img className={styles.houseImage} src={homeIcon} alt="Huis" width="32" height="30" />
              {this.renderDropdownContent()}
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {
              (__CLIENT__ && this.checkDimensions().width < 768 && placeId) &&
                <div className={styles.dropdownContent}>{this.renderDropdownContent(true)}</div>
            }
            <MenuItem eventKey={4.1} href={selectPlaceUrl}>Wissel van huis</MenuItem>
            <MenuItem eventKey={4.2} href={myAccountUrl}>Mijn Tippiq Account</MenuItem>
            <LinkContainer to="/logout">
              <MenuItem eventKey={4.3}>Uitloggen bij Tippiq Buurt</MenuItem>
            </LinkContainer>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }

  /**
   * Render
   * @function render
   * @returns {string} Markup of the residents screen.
   */
  render() {
    const { loggedIn, hideMenu } = this.props;
    return (
      <Navbar inverse className={styles.navBar}>
        <Navbar.Header className={styles.navBarHeader}>
          <Navbar.Brand className={styles.navBarBrand}>
            <Link to="/">
              <img src={tippiqBuurtLogo} alt="Tippiq Buurt" className={styles.headerImage} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {!hideMenu && loggedIn && this.renderDropDownItems()}
        {!hideMenu && loggedIn && this.renderMenuButtons()}
        {!hideMenu && !loggedIn && this.renderMenuItems()}
      </Navbar>
    );
  }
}
