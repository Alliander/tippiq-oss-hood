/**
 * Styleguide container.
 * @module containers/Styleguide
 */

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {
  Button,
  ButtonGroup,
  FormGroup,
  Row,
  Col,
  Grid,
} from 'react-bootstrap';

import {
    NavBar,
    Footer,
    SearchBar,
    Selectors,
    ThemeFilter,
    ServiceFilter,
    DesktopSort,
    Card,
} from '../../components';
import { AddressSuggestion } from '../';

/**
 * Styleguide container.
 * @function Styleguide
 * @returns {string} Markup of the styleguide page.
 */
export default class StyleGuide extends Component {

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.selectAddressSuggestion = this.selectAddressSuggestion.bind(this);
    this.state = {
      addressSuggestion: null,
    };
  }

  /**
   * Select address suggestion
   * @method selectAddressSuggestion
   * @param {Object} suggestion Suggestion object
   * @returns {undefined}
   */
  selectAddressSuggestion(suggestion) {
    this.setState({
      addressSuggestion: suggestion,
    });
  }

  /**
   * renders.
   * @function renders
   * @returns {string} Markup of the styleguide page.
   */
  render() {
    return (
      <div id="page-styleguide">
        <Helmet title="Styleguide" />
        <NavBar />
        <div>
          <AddressSuggestion
            value={this.state.addressSuggestion}
            setValue={this.selectAddressSuggestion}
          />
        </div>
        <div className="container">
          <h1>Desktop Styles
            <mark>1</mark>
          </h1>
          <p>This is a paragraph with a <a href="https://www.tippiq.nl">link</a>.</p>
        </div>
        <Grid>
          <Row>
            <Card
              blocks={[
                {
                  label: 'Klussen',
                  value: '€47.00 per uur',
                },
                {
                  label: 'Looptijd',
                  value: '3 maanden',
                },
                {
                  label: 'Bla',
                  value: 'Test',
                },
                {
                  label: 'Bla',
                  value: 'Test 2',
                },
                {
                  label: 'Bla',
                  value: 'Test 3',
                },
              ]}
              content="text"
              ctaLabel="Bekijk aanbieder 3"
              ctaLink="https://www.dinst.nl/aan-huis/arno-van-den-boomen"
              distance="3.2"
              serviceTitle="nudge"
              serviceLogo="https://pbs.twimg.com/profile_images/443515043787718657/vKzm_jRv_400x400.png"
              serviceDescription="NLvoorelkaar is een online platform waar mensen elkaar kunnen vinden en helpen. Samen werken we aan een zorgzame samenleving in Nederland. Hulp vragen of iemand hulp bieden wanneer jou dat uitkomt. Eenmalig, iedere week, alles daartussen in én bij jou in de buurt. Betrouwbaar, gemakkelijk, en gratis!"
              serviceUrl="http://www.tippiq.nl"
              image="https://media-cdn.tripadvisor.com/media/photo-s/01/90/78/c5/sunset-over-dinner-nice.jpg"
            />
          </Row>
          <Row>
            <Col sm={12}>
              <DesktopSort />
              <div className="filter-view-container">
                <p className="filter-list">Gekozen filters: <Button bsStyle="link">Wis filters</Button>
                  <span className="filter-list-items">
                    <span>Activiteiten<i className="fa fa-times" /></span>
                    <span>Urgent<i className="fa fa-times" /></span>
                    <span>Craze<i className="fa fa-times" /></span>
                    <span>Groengelinkt<i className="fa fa-times" /></span>
                    <span>PetBNB<i className="fa fa-times" /></span>
                  </span>
                </p>
              </div>
            </Col>
            <hr />
          </Row>
          <Row>
            <Col sm={4}>
              <SearchBar />
              <Selectors />
              <ThemeFilter />
              <ServiceFilter />
            </Col>
          </Row>
        </Grid>
        <Grid>
          <h1>Mobile layout</h1>
          <p>Put your browser in mobile viewing mode</p>
          <hr />
          <ButtonGroup>
            <Button>Filteren</Button>
            <Button>Sorteren</Button>
            <Button>Kaart</Button>
          </ButtonGroup>
          <div className="sort-popup">
            <ul>
              <li className="sort-item">
                <FormGroup>
                  <div className="radio">
                    <input type="radio" id="distance" />
                    <label htmlFor="distance">Afstand</label>
                  </div>
                </FormGroup>
              </li>
              <li className="sort-item">
                <FormGroup>
                  <div className="radio">
                    <input type="radio" id="diverse" />
                    <label htmlFor="diverse">Divers</label>
                  </div>
                </FormGroup>
              </li>
              <li className="sort-item">
                <FormGroup>
                  <div className="radio">
                    <input type="radio" id="latest" checked="checked" />
                    <label htmlFor="latest">Nieuwste</label>
                  </div>
                </FormGroup>
              </li>
            </ul>
          </div>
          <div className="filter-view-container">
            <p className="filter-list">Gekozen filters: <Button bsStyle="link">Wis filters</Button>
              <span className="filter-list-items">
                <span>Activiteiten<i className="fa fa-times" /></span>
                <span>Urgent<i className="fa fa-times" /></span>
                <span>Craze<i className="fa fa-times" /></span>
                <span>Groengelinkt<i className="fa fa-times" /></span>
                <span>PetBNB<i className="fa fa-times" /></span>
              </span>
            </p>
          </div>
          <Selectors />

          <div className="theme-filter-container">
            <h2>Thema&#39;s</h2>
            <ul className="themes-filter">
              <li className="filter-active">Activiteiten<span><i className="fa fa-times" /></span></li>
              <li>Lenen en Delen<span>15</span></li>
              <li>Urgent<span>&nbsp;</span></li>
              <li>Werkzaamheden<span>4</span></li>
            </ul>
          </div>
          <div className="service-filter-container-mobile">
            <h2>Diensten</h2>
            <form>
              <div className="theme-container">
                <span>Activiteiten</span>
                <ul>
                  <li className="service-item">
                    <FormGroup>
                      <div className="checkbox active">
                        <label htmlFor="craze">
                          <input type="checkbox" id="craze" defaultChecked="defaultChecked" />
                          Craze
                        </label>
                      </div>
                    </FormGroup>
                  </li>
                  <li className="service-item">
                    <FormGroup>
                      <div className="checkbox active">
                        <label htmlFor="groengelinkt">
                          <input type="checkbox" id="groengelinkt" defaultChecked="defaultChecked" />
                          Groengelinkt
                        </label>
                      </div>
                    </FormGroup>
                  </li>
                </ul>
              </div>
              <div className="theme-container">
                <span>De buurt verbeteren</span>
                <ul>
                  <li className="service-item">
                    <FormGroup>
                      <div className="checkbox">
                        <label htmlFor="Verbeterdebuurt"><input type="checkbox" id="Verbeterdebuurt" />Verbeterdebuurt</label>
                      </div>
                    </FormGroup>
                  </li>
                  <li className="service-item">
                    <FormGroup>
                      <div className="checkbox">
                        <label htmlFor="Nudge"><input type="checkbox" id="Nudge" />Nudge</label>
                      </div>
                    </FormGroup>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </Grid>
        <Footer />
      </div>
    );
  }
}
