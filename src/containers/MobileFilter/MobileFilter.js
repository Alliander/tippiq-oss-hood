/**
 * MobileFilter container.
 * @module containers/MobileFilter
 */
import React, { Component } from 'react';
import {
  Button,
  Modal,
} from 'react-bootstrap';

import {
  ServiceFilter,
  ThemeFilter,
} from '../';

/**
 * MobileFilter container.
 * @class MobileFilter
 */
export default class MobileFilter extends Component {
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
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  /**
   * onClose
   * @method onClose
   * @returns {undefined}
   */
  onClose() {
    this.setState({
      open: false,
    });
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
   * Render markup
   * @method render
   * @returns {string} Markup of the container.
   */
  render() {
    return (
      <Button onClick={this.onOpen}>
        Filteren
        <Modal show={this.state.open} onHide={this.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Filteren op:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ThemeFilter />
            <ServiceFilter />
          </Modal.Body>
        </Modal>
      </Button>
    );
  }
}
