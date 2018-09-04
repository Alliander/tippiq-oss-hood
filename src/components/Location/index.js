/**
 * Location component.
 * @module components/Location
 */

import React, { Component, PropTypes } from 'react';

import mapIcon from '../../static/leaflet/map-green.png';
import mapIcon2x from '../../static/leaflet/map-green-2x.png';
import mapIconShadow from '../../static/leaflet/marker-shadow.png';

let Map;
let TileLayer;
let Marker;
let Leaflet;

/**
 * Location Container class.
 * @class Location
 * @extends Component
 */
export default class Location extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    placeLocation: PropTypes.object.isRequired,
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    // Only runs on Client, not on server render
    // https://github.com/PaulLeCam/react-leaflet/issues/45
    Map = require('react-leaflet').Map; // eslint-disable-line
    TileLayer = require('react-leaflet').TileLayer; // eslint-disable-line
    Marker = require('react-leaflet').Marker; // eslint-disable-line
    Leaflet = require('leaflet'); // eslint-disable-line
    this.forceUpdate();
  }

  /**
   * Render method
   * @function render
   * @returns {string} Markup of the container.
   */
  render() {
    const { placeLocation } = this.props;
    if (!placeLocation.result) return null;

    const {
      geometry,
    } = placeLocation.result;
    const position = [geometry.coordinates[1], geometry.coordinates[0]];
    const icon = Leaflet ?
      Leaflet.icon({
        iconUrl: mapIcon,
        iconRetinaUrl: mapIcon2x,
        shadowUrl: mapIconShadow,
        iconSize: [60, 71], // size of the icon
        shadowSize: [53, 23], // size of the shadow
        iconAnchor: [30, 71], // point of the icon which will correspond to marker's location
        shadowAnchor: [2, 23],  // the same for the shadow
        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
      }) : null;

    const map = Map ?
      (<Map center={position} zoom={16}>
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon} />
      </Map>) : null;

    return (
      <div>
        {map}
      </div>
    );
  }
}
