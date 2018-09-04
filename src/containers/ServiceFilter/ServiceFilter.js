/**
 * ServiceFilter container.
 * @module containers/Filter/ServiceFilter
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ServiceFilter as ServiceFilterComponent } from '../../components';
import { getServices, toggleServiceFilter } from '../../actions';

/**
 * ServiceFilter container.
 * @class ServiceFilter
 */
export class ServiceFilter extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    enabledServices: PropTypes.array,
    getServices: PropTypes.func.isRequired,
    filteredServices: PropTypes.array,
    toggleServiceFilter: PropTypes.func.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.handleToggleServiceFilter = this.handleToggleServiceFilter.bind(this);
  }

  /**
   * handleToggleServiceFilter
   * @method handleToggleServiceFilter
   * @param {String} id service-id
   * @returns {undefined}
   */
  handleToggleServiceFilter(id) {
    this.props.toggleServiceFilter(id);
  }

  /**
   * Render markup
   * @method render
   * @returns {string} Markup of the container.
   */
  render() {
    const result = _(this.props.filteredServices)
      .groupBy(service => service.category)
      .map((value, key) => ({ category: key, services: value }))
      .value();
    return (
      <ServiceFilterComponent
        enabledServices={this.props.enabledServices}
        services={result}
        toggleServiceFilter={this.handleToggleServiceFilter}
      />
    );
  }
}

export default connect(
  state => ({
    enabledServices: state.services.enabledServices,
    filteredServices: state.services.filteredServices,
  }), ({
    getServices,
    toggleServiceFilter,
  })
)(ServiceFilter);
