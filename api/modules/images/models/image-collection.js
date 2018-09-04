/**
 * Image Collection Model.
 * @module modules/images/models/image-collection
 */

import debugLogger from 'debug-logger';
import { reduce, merge } from 'lodash';
import bookshelf from '../../../common/bookshelf';
import Image from './image-model';

const debug = debugLogger('tippiq-hood:images:collection');

const instanceProps = {
  model: Image,
  serialize(options = {}) { // eslint-disable-line complexity
    switch (options.context) {
      case 'card':
      case 'card-stream':
      case 'service':
      case 'email:weekly-notification':
        return reduce(this.map(image => image.serialize(options)), merge);

      default:
        debug('unknown serialization context \'%s\'', options.context);
        return {};
    }
  },
};

const classProps = {};

export default bookshelf.Collection.extend(instanceProps, classProps);
