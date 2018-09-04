/**
 * ThemeFilter container.
 * @module containers/Filter/ThemeFilter
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { ThemeFilter as ThemeFilterComponent } from '../../components';
import { getServices, toggleThemeFilter } from '../../actions';

/**
 * ThemeFilter container.
 * @class ThemeFilter
 */
export class ThemeFilter extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    enabledServices: PropTypes.array,
    enabledThemes: PropTypes.array,
    getServices: PropTypes.func.isRequired,
    themes: PropTypes.array,
    toggleThemeFilter: PropTypes.func.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.handleToggleThemeFilter = this.handleToggleThemeFilter.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getServices();
  }

  /**
   * handleToggleThemeFilter
   * @method handleToggleThemeFilter
   * @param {String} id theme-id
   * @returns {undefined}
   */
  handleToggleThemeFilter(id) {
    this.props.toggleThemeFilter(id);
  }

  /**
   * Render markup
   * @method render
   * @returns {string} Markup of the container.
   */
  render() {
    return (
      <ThemeFilterComponent
        enabledThemes={this.props.enabledThemes}
        themes={this.props.themes}
        toggleThemeFilter={this.handleToggleThemeFilter}
      />
    );
  }
}

export default connect(
  state => ({
    enabledServices: state.services.enabledServices,
    enabledThemes: state.services.enabledThemes,
    themes: state.services.themes,
  }), ({
    getServices,
    toggleThemeFilter,
  })
)(ThemeFilter);
