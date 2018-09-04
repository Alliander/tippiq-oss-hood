/**
 * ThemeFilter component.
 * @module component/ThemeFilter
 */

import React, { Component, PropTypes } from 'react';

/**
 * Theme component.
 * @class Input
 * @extends Component
 */
class Theme extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    theme: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Handler for click action.
   * @method handleClick
   * @returns {undefined}
   */
  handleClick() {
    this.props.onClick(this.props.theme);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <li className={(this.props.selected && 'filter-active') || ''}>
        <a tabIndex="0" onClick={this.handleClick}>
          {this.props.theme}
          <span>
            <i className="fa fa-times" />
          </span>
        </a>
      </li>
    );
  }
}

/**
 * ThemeFilter component.
 * @function ThemeFilter
 * @param {Object} props Component properties.
 * @param {Array} props.enabledServices Array of enabled services.
 * @param {Array} props.themes Array of available themes.
 * @param {Function} props.toggleThemeFilter Event handler to toggle a theme.
 * @returns {string} Markup of the ThemeFilter page.
 */
const ThemeFilter = ({ enabledThemes, themes, toggleThemeFilter }) =>
  <div className="theme-filter-container">
    <h2>Thema&#39;s</h2>
    <ul className="themes-filter">
      {themes.map(theme =>
        <Theme
          key={theme}
          theme={theme}
          selected={enabledThemes.indexOf(theme) !== -1}
          onClick={toggleThemeFilter}
        />
      )}
    </ul>
  </div>;

ThemeFilter.propTypes = {
  enabledThemes: PropTypes.array,
  themes: PropTypes.array,
  toggleThemeFilter: PropTypes.func,
};

ThemeFilter.defaultProps = {
  themes: [],
};

export default ThemeFilter;
