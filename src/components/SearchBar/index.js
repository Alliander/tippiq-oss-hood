/**
 * SearchBar component.
 * @module component/SearchBar
 */

import React from 'react';
import {
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap';

import styles from './SearchBar.css';

/**
 * SearchBar container.
 * @function SearchBar
 * @returns {string} Markup of the searchbar component.
 */

const SearchBar = () =>
  <div>
    <InputGroup>
      <FormControl type="text" placeholder="Zoeken..." />
      <InputGroup.Button>
        <Button bsStyle="primary">
          <i className="fa fa-search" />
        </Button>
      </InputGroup.Button>
    </InputGroup>
    <hr className={styles.ruler} />
  </div>;

export default SearchBar;
