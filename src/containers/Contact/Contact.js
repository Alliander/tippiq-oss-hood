/**
 * Contact container.
 * @module components/Contact
 */

import React, { PropTypes, Component } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { StaticPage } from '../../containers';
import { Field, Location, Button } from '../../components';
import { sendContactForm } from '../../actions';
import styles from './Contact.css';

/**
 * Contact component.
 * @function Contact
 * @returns {string} Markup of the Contact page.
 */
export class Contact extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    sendContactForm: PropTypes.func,
    pending: PropTypes.bool,
    error: PropTypes.bool,
    success: PropTypes.bool,
  }

  /**
   * constructor
   * @method constructor
   * @param {props} props object
   * @returns {void}
   */
  constructor(props) {
    super(props);
    this.state = {
      name: {},
      email: {},
      subject: {},
      message: {},
    };
    this.formChange = this.formChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * formChange
   * @method formChange
   * @param {name} name string
   * @param {state} state object
   * @returns {void}
   */
  formChange(name, state) {
    this.setState({
      [name]: state,
    });
  }

  /**
   * handleSubmit
   * @method handleSubmit
   * @param {event} event object
   * @returns {void}
   */
  handleSubmit(event) {
    event.preventDefault();
    const { name, email, subject, message } = this.state;
    const { pending } = this.props;
    if (name.success && email.success && subject.success && message.success && !pending) {
      this.props.sendContactForm({
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
      });
    }
  }

  /**
   * render
   * @method render
   * @returns {JSX} Markup
   */
  render() {
    const { name, email, subject, message } = this.state;
    const { pending, error, success } = this.props;
    const enabled = name.success && email.success && subject.success && message.success && !pending;
    const showError = !pending && error;
    const showSuccess = !pending && success;
    const tippiqOfficeLocation = {
      result: { geometry: { coordinates: [5.1175405, 52.0823264] } },
    };

    return (
      <StaticPage title="Contact" id="page-contact">
        <h1>Neem contact met ons op</h1>
        <Row>
          <Col sm={6} md={8}>
            <p>
              Heb je vragen op opmerkingen? Stuur ons een bericht via onderstaand
              contactformulier.
            </p>
            <p>
              Heb je een tip of mooie ervaring die je wilt delen, laat het ons weten.
              Onze accounts zijn actief op werkdagen tussen 9:00 en 17:00, we proberen
              binnen 24 uur te reageren.
            </p>
          </Col>
          <Col sm={6} md={4}>
            <p>Uiteraard zijn we ook bereikbaar via:</p>
            <ul className={styles.links}>
              <li><a href="mailto:team@tippiq.nl"><i className="fa fa-envelope-o" />team@tippiq.nl</a></li>
              <li><a href="https://www.facebook.com/Tippiq-1430219107214646"><i className="fa fa-facebook" />tippiq op facebook</a></li>
              <li><a href="https://twitter.com/tippiq"><i className="fa fa-twitter" />tippiq op twitter</a></li>
            </ul>
          </Col>
        </Row>
        <h2>Stuur ons een bericht</h2>
        {showSuccess &&
          <Alert bsStyle="success">
            <strong>Dank je!</strong> We nemen contact met je op.
          </Alert>
        }
        {showError &&
          <Alert bsStyle="danger">
            <strong>Oeps!</strong> Er is iets verkeerd gegaan.
          </Alert>
        }
        <form action="/api/contact" method="post" onSubmit={this.handleSubmit} className={styles.form}>
          <Field field={{ name: 'name', error: 'Je hebt geen naam ingevuld' }} placeholder="Je naam" type="text" required onStateChange={this.formChange} />
          <Field field={{ name: 'email' }} placeholder="Je emailadres" type="email" required onStateChange={this.formChange} />
          <Field field={{ name: 'subject', error: 'Je hebt geen onderwerp ingevuld' }} placeholder="Onderwerp" type="text" required onStateChange={this.formChange} />
          <Field field={{ name: 'message', error: 'Je hebt geen bericht ingevuld' }} placeholder="Typ hier je bericht" type="textarea" required rows={6} onStateChange={this.formChange} />
          <Row>
            <Col sm={6}>
              <Button
                type="submit"
                responsive
                disabled={!enabled}
              >
                Bericht versturen
              </Button>
            </Col>
          </Row>
        </form>
        <h2>Of kom eens langs!</h2>
        <Row>
          <Col sm={6}>
            Tippiq is gevestigd in HNK Utrecht<br />Centraal Station.<br />
            Arthur van Schendelstraat 650<br />
            3511 MJ Utrecht
            <p><a href="https://www.openstreetmap.org/node/2714047669" className={styles.route}>bekijk routebeschrijving</a></p>
          </Col>
          <Col sm={6}>
            <Location
              placeLocation={tippiqOfficeLocation}
            />
          </Col>
        </Row>
      </StaticPage>
    );
  }
}

export default connect(
  state => ({
    pending: state.contact.pending,
    error: state.contact.error,
    success: state.contact.success,
  }),
  {
    sendContactForm,
  }
)(Contact);
