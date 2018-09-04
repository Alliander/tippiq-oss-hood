/**
 * Bookshelf BaseModel.
 * @module common/base-model
 */

import { reduce } from 'lodash/collection';
import { camelCase, snakeCase } from 'lodash/string';

import bookshelf from './bookshelf';

const instanceProps = {
  parse(attrs) {
    return reduce(attrs, (memo, val, key) => {
      const modifiedMemo = memo;
      modifiedMemo[camelCase(key)] = val;
      return modifiedMemo;
    }, {});
  },
  format(attrs) {
    return reduce(attrs, (memo, val, key) => {
      const modifiedMemo = memo;
      modifiedMemo[snakeCase(key)] = val;
      return modifiedMemo;
    }, {});
  },
  // via http://stackoverflow.com/a/29157174/363448
  orderBy(column, order) {
    return this.query(qb => {
      qb.orderBy(column, order);
    });
  },
  updateWith(data) {
    this.keys().forEach(key => {
      if (key !== this.idAttribute && typeof data[key] !== 'undefined') {
        this.set(key, data[key]);
      }
    });
  },
};

const classProps = {};

export default bookshelf.Model.extend(instanceProps, classProps);
