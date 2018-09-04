/**
 * Field component.
 * @module components/Field
 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

 /**
 * Field component.
 * @class Field
 */
class Field extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    field: PropTypes.object.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    selected: PropTypes.any,
    ref: PropTypes.any,
    action: PropTypes.func,
    required: PropTypes.bool,
    autoFocus: PropTypes.any,
    rows: PropTypes.number,
    onStateChange: PropTypes.func,
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      error: false,
      success: null,
    };
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }

  /**
   * onStateChange
   * @method onStateChange
   * @returns {void}
   */
  onStateChange() {
    if (this.props.onStateChange) {
      this.props.onStateChange(this.props.field.name, this.state);
    }
  }

  /**
   * renderLabel
   * @method renderLabel
   * @returns {string} Markup of the container.
   */
  renderLabel() {
    const { field, label } = this.props;
    if (label && field.name) {
      return (
        <label htmlFor={field.name}>
          {label}
        </label>
      );
    }
    return null;
  }

  /**
   * render.
   * @function render
   * @returns {string} Markup of the container.
   */
  render() {
    const {
      type,
      field,
    } = this.props;
    let content = null;
    const label = this.renderLabel();

    switch (type) {
      case 'checkbox':
        content = this.renderCheckbox();
        break;
      case 'radio':
        content = this.renderRadioButton();
        break;
      case 'textarea':
        content = this.renderTextarea();
        break;
      default:
        content = this.renderInput();
        break;
    }

    return (
      <div className={`${field.error && field.touched ? ' has-error' : ''}`}>
        {label}
        {content}
      </div>
    );
  }

  /**
   * renderError.
   * @function renderError
   * @returns {string} Markup of the container.
   */
  renderError() {
    const { field } = this.props;
    if (this.state.error || (field.error && field.touched)) {
      const errorMessage = field.error || this.state.error;
      return (
        <div className="text-danger">{errorMessage}</div>
      );
    }
    return null;
  }
  /**
   * renderRadioButton
   * @method renderRadioButton
   * @returns {string} Markup of the container.
   */
  renderRadioButton() {
    return null;
  }

  /**
   * renderCheckbox
   * @method renderCheckbox
   * @returns {string} Markup of the container.
   */
  renderCheckbox() {
    const { field, type, action, selected, required } = this.props;
    return (
      <input
        type={type}
        id={field.name}
        checked={selected}
        readOnly
        ref={(input) => { this.field = input; }}
        onClick={action}
        onChange={this.onChange}
        required={required}
      />
    );
  }

  /**
   * onChange
   * @method onChange
   * @returns {undefined}
   */
  onChange() {
    this.setState({
      value: this.getValue(),
    });
    window.setTimeout(() => {
      this.validate();
    }, 400);
  }

  /**
   * getValue
   * @method getValue
   * @returns {string} Value value.
   */
  getValue() {
    const { type } = this.props;
    if (type === 'checkbox') {
      return findDOMNode(this.field).checked;
    }
    return findDOMNode(this.field).value;
  }

  /**
   * validate
   * @method validate
   * @returns {bool} Check check
   */
  validate() {
    if (this.props.required && !this.getValue()) {
      if (this.props.type === 'email') {
        this.setState({ error: 'Je hebt geen e-mailadres ingevoerd', success: false }, this.onStateChange);
      } else {
        this.setState({ error: this.props.field.error || 'Je hebt geen waarde ingevoerd', success: false }, this.onStateChange);
      }
      return false;
    }
    if (this.props.type === 'email' && this.getValue()) {
      return this.validateEmail();
    }
    this.setState({ success: true, error: false }, this.onStateChange);
    return true;
  }

  /**
   * validateEmail
   * @method validateEmail
   * @returns {bool} Check check
   */
  validateEmail() {
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) // eslint-disable-line max-len
      .test(this.getValue()) && !(/.+@.+\..{2,}/).test(this.getValue())) {
      this.setState({ error: 'Het ingevoerde e-mailadres is ongeldig', success: false }, this.onStateChange);
      return false;
    }
    this.setState({ success: true, error: false }, this.onStateChange);
    return true;
  }

  /**
   * trim
   * @method strim
   * @param {object} elem value
   * @returns {string} Trim trim
   */
  trim(elem) {
    let val;
    const element = findDOMNode(elem);
    const text = element.querySelector('input[type=text]');
    const email = element.querySelector('input[type=email]');
    const textValue = (text) ?
      text.value :
      null;

    const emailValue = (email) ?
      email.value :
      null;

    if (textValue) {
      val = textValue.trim();
      text.value = val;
    }

    if (emailValue) {
      val = emailValue.trim();
      val = val.toLowerCase();
      email.value = val;
    }
  }

  /**
   * renderTextarea
   * @method renderTextarea
   * @returns {string} Markup of the container.
   */
  renderTextarea() {
    const { field, disabled, placeholder, required, autoFocus, rows } = this.props;
    let state = '';
    if (this.state.success) {
      state = 'has-success';
    } else if (!this.state.success && this.state.success !== null) {
      state = 'has-error';
    }

    return (
      <div className={`form-group ${state}`}>
        <textarea
          className="form-control"
          id={field.name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          ref={(input) => { this.field = input; }}
          onChange={this.onChange}
          required={required}
          autoFocus={autoFocus}
          autoComplete="off"
        />
        {this.renderError()}
      </div>
    );
  }

 /**
   * renderInput
   * @method renderInput
   * @returns {string} Markup of the container.
   */
  renderInput() {
    const { field, type, disabled, placeholder, required, autoFocus } = this.props;
    let state = '';
    if (this.state.success) {
      state = 'has-success';
    } else if (!this.state.success && this.state.success !== null) {
      state = 'has-error';
    }

    return (
      <div className={`form-group ${state}`}>
        <input
          type={type}
          className="form-control"
          id={field.name}
          placeholder={placeholder}
          disabled={disabled}
          ref={(input) => { this.field = input; }}
          onChange={this.onChange}
          required={required}
          autoFocus={autoFocus}
          autoComplete="off"
        />
        {this.renderError()}
      </div>
    );
  }
}

export default Field;
