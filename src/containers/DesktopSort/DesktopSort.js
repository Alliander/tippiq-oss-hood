/**
 * DesktopSort container.
 * @module containers/DesktopSort
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { DesktopSort as DesktopSortComponent } from '../../components';
import { setSort } from '../../actions';

/**
 * DesktopSort container.
 * @class DesktopSort
 */
export class DesktopSort extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    current: PropTypes.string,
    setSort: PropTypes.func.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.setSort = this.setSort.bind(this);
  }

  /**
   * setSort
   * @method setSort
   * @param {String} id Sort method
   * @returns {undefined}
   */
  setSort(id) {
    this.props.setSort(id);
  }

  /**
   * Render markup
   * @method render
   * @returns {string} Markup of the container.
   */
  render() {
    return (
      <DesktopSortComponent
        current={this.props.current}
        setSort={this.setSort}
      />
    );
  }
}

export default connect(
  state => ({
    current: state.cards.sort,
  }), ({
    setSort,
  })
)(DesktopSort);
