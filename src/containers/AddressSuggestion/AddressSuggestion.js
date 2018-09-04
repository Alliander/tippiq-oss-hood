/**
 * AddressSuggestion component.
 * @module containers/AddressSuggestion
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import { debounce } from 'lodash';

import {
  updateAddressSuggestionValue,
  clearAddressSuggestions,
  getAddressSuggestions,
} from '../../actions';
import { Address } from '../../helpers';
import styles from './AddressSuggestion.css';

/**
 * Address suggestion container.
 * @class AddressSuggestion
 */
export class AddressSuggestion extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    suggestionsLoaded: PropTypes.bool.isRequired,
    clearAddressSuggestions: PropTypes.func.isRequired,
    getAddressSuggestions: PropTypes.func.isRequired,
    updateAddressSuggestionValue: PropTypes.func.isRequired,
    required: PropTypes.any.isRequired,
    error: PropTypes.bool,
    autoFocus: PropTypes.bool,
    addressSuggestion: PropTypes.any,
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.getAddressSuggestions = debounce(obj => this.props.getAddressSuggestions(obj.value), 350);
    this.selectAddressSuggestion = this.selectAddressSuggestion.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      pristine: true,
      error: false,
      success: null,
    };
  }

  /**
   * Will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      this.setState({
        success: !nextProps.error,
      });
    }
    if (nextProps.addressSuggestion.selected && (this.props.addressSuggestion.selected !==
      nextProps.addressSuggestion.selected)) {
      this.setState({
        error: false,
      });
    }
    // select address if only one is returned from search
    if (nextProps.suggestions.length === 1 && nextProps.suggestions[0].type === 'HouseAddress') {
      this.props.updateAddressSuggestionValue(
        Address.fromJson(nextProps.suggestions[0]).toSearchString(), nextProps.suggestions[0]);
    }
  }

  /**
   * On change handler
   * @method onChange
   * @param {Object} event Event object
   * @param {String} obj Current value
   * @returns {undefined}
   */
  onChange(event, obj) {
    const { newValue } = obj;
    this.props.updateAddressSuggestionValue(newValue);
    this.setState({
      pristine: false,
    });
  }

  /**
   * On blur handler
   * @method onBlur
   * @param {Object} event Event object
   * @returns {undefined}
   */
  onBlur(event, { focusedSuggestion }) {
    if (focusedSuggestion) {
      this.props.updateAddressSuggestionValue(
        Address.fromJson(focusedSuggestion).toSearchString(),
        focusedSuggestion
      );
      this.setState({
        error: false,
      });
    } else if (!this.props.addressSuggestion.selected) {
      this.setState({
        error: true,
      });
    }
  }

  /**
   * Get suggestion value
   * @method getSuggestionValue
   * @param {Object} suggestion Suggestion object
   * @returns {string} Suggestion string
   */
  getSuggestionValue(suggestion) {
    return Address.fromJson(suggestion).toSearchString();
  }

  /**
   * Select address suggestion
   * @method selectAddressSuggestion
   * @param {Object} event Event object
   * @param {Object} obj Select object
   * @returns {undefined}
   */
  selectAddressSuggestion(event, obj) {
    this.props.updateAddressSuggestionValue(Address.fromJson(obj.suggestion).toSearchString(),
      obj.suggestion);
  }

  /**
   * Render suggestion
   * @method renderSuggestion
   * @param {Object} suggestion Suggestion object
   * @returns {string} Markup of the suggestion
   */
  renderSuggestion(suggestion) {
    return <div>{Address.fromJson(suggestion).toSearchString()}</div>;
  }

  /**
   * renderError.
   * @function renderError
   * @returns {string} Markup of the container.
   */
  renderError() {
    if (!this.props.addressSuggestion.query && !this.state.pristine) {
      return (
        <div className="text-danger">
          Je hebt geen adres ingevuld.
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className="text-danger">
          Wij kunnen het opgegeven adres niet vinden.
        </div>
      );
    }
    return null;
  }

  /**
   * renders.
   * @function renders
   * @returns {string} Markup of the container.
   */
  render() {
    const inputProps = {
      placeholder: 'Straat en huisnummer',
      value: this.props.addressSuggestion.query,
      onChange: this.onChange,
      onBlur: this.onBlur,
      required: this.props.required,
      autoFocus: this.props.autoFocus,
    };

    let state = '';
    if (this.state.success) {
      state = 'has-success';
    } else if (!this.state.success && this.state.success !== null) {
      state = 'has-error';
    }

    return (
      <div className={`form-group ${state}`}>
        <Autosuggest
          suggestions={this.props.suggestions}
          onSuggestionsFetchRequested={this.getAddressSuggestions}
          onSuggestionsClearRequested={this.props.clearAddressSuggestions}
          onSuggestionSelected={this.selectAddressSuggestion}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          theme={{
            input: 'form-control',
            suggestionsContainer: `${styles.suggestContainer}`,
            suggestionsList: `${styles.suggestList}`,
            suggestion: `${styles.suggestItem}`,
            suggestionFocused: `${styles.suggestItemFocused}`,
          }}
        />
        {this.renderError()}
      </div>
    );
  }
}

export default connect(
  state => ({
    addressSuggestion: state.addressSuggestion,
    suggestions: state.addressSuggestion.items,
    suggestionsLoaded: !state.addressSuggestion.pending,
  }), ({
    updateAddressSuggestionValue,
    clearAddressSuggestions,
    getAddressSuggestions,
  })
)(AddressSuggestion);
