/**
 * ServiceFilter component.
 * @module component/ServiceFilter
 */

import React, { Component, PropTypes } from 'react';
import { FormGroup } from 'react-bootstrap';

/**
 * Input component.
 * @class Input
 * @extends Component
 */
class Input extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
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
    this.props.onClick(this.props.id);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <input
        type="checkbox"
        id={this.props.id}
        checked={this.props.selected}
        readOnly
        onClick={this.handleClick}
      />
    );
  }
}

/**
 * ServiceFilter component.
 * @function ServiceFilter
 * @param {Object} props Component properties.
 * @param {Array} props.services Array of available services.
 * @param {Array} props.enabledServices Array of enabled services.
 * @param {Function} props.toggleServiceFilter Event handler to toggle a service.
 * @returns {string} Markup of the ServiceFilter page.
 */
const ServiceFilter = ({ services, enabledServices, toggleServiceFilter }) =>
  <div className="service-filter-container-mobile">
    <h2>Diensten</h2>
    <form>
      {services.map(category =>
        <div className="theme-container" key={category.category}>
          <span>{category.category}</span>
          <ul>
            {category.services.map(service =>
              <li className="service-item" key={service.id}>
                <FormGroup>
                  <div className="checkbox active">
                    <label htmlFor={service.id}>
                      <Input
                        id={service.id}
                        selected={enabledServices.indexOf(service.id) !== -1}
                        onClick={toggleServiceFilter}
                      />
                      {service.name}
                    </label>
                  </div>
                </FormGroup>
              </li>
            )}
          </ul>
        </div>
      )}
    </form>
  </div>;

ServiceFilter.propTypes = {
  services: PropTypes.array,
  enabledServices: PropTypes.array,
  toggleServiceFilter: PropTypes.func,
};

ServiceFilter.defaultProps = {
  services: [],
};

export default ServiceFilter;
