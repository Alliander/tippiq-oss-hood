/**
 * Success container.
 * @module containers/PlacePolicies/Success
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { updatePlaceSettings } from '../../actions';

/**
 * Success component class.
 * @class PlacePoliciesSuccess
 * @extends Component
 */
class PlacePoliciesSuccess extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    updatePlaceSettings: PropTypes.func.isRequired,
    placeSettings: PropTypes.shape(),
    location: PropTypes.shape({
      query: PropTypes.shape({
        code: PropTypes.string,
        place: PropTypes.string,
      }),
    }),
  };

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { code, place } = this.props.location ? this.props.location.query : {};
    if (code) {
      this.props.updatePlaceSettings(place, code);
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.placeSettings.success) {
      browserHistory.push('/mijn-buurt');
    }
  }

  /**
   * render.
   * @function render
   * @returns {string} Markup of the Component.
   */
  render() {
    return this.props.placeSettings.error &&
      <div>Er ging iets mis, je huisregels konden niet worden verwerkt :(</div>;
  }
}

export default connect(
  state => ({
    placeSettings: state.placeSettings,
  }), ({
    updatePlaceSettings,
  })
)(PlacePoliciesSuccess);
