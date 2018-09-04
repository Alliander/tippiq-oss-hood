/**
 * MobileSort container.
 * @module containers/MobileSort
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { MobileSort as MobileSortComponent } from '../../components';
import { setSort } from '../../actions';

/**
 * MobileSort container.
 * @class MobileSort
 */
export class MobileSort extends Component {
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
    this.state = {
      open: false,
    };
    this.setSort = this.setSort.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  /**
   * onOpen
   * @method onOpen
   * @returns {undefined}
   */
  onOpen() {
    this.setState({
      open: true,
    });
  }

  /**
   * setSort
   * @method setSort
   * @param {Object} event Event
   * @returns {undefined}
   */
  setSort(event) {
    this.props.setSort(event.target.value);
    this.setState({
      open: false,
    });
  }

  /**
   * Render markup
   * @method render
   * @returns {string} Markup of the container.
   */
  render() {
    return (
      <MobileSortComponent
        current={this.props.current}
        open={this.state.open}
        setSort={this.setSort}
        onOpen={this.onOpen}
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
)(MobileSort);
