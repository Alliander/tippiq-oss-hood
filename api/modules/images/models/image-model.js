/**
 * ImageModel.
 * @module modules/images/models/image-model
 */

import debugLogger from 'debug-logger';
import _ from 'lodash';
import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-hood:images:model');

const instanceProps = {
  tableName: 'image',
  serialize(options = {}) { // eslint-disable-line complexity
    switch (options.context) {
      case 'service':
      case 'card':
      case 'card-stream':
      case 'card-cta-redirect':
      case 'email:weekly-notification':
        if (!this.pivot) {
          debug('no card pivot for image \'%s\'', this.get('id'));
          return {};
        }
        return _({}).set(this.pivot.get('key'), this.get('url')).value();

      default:
        debug('unknown serialization context \'%s\'', options.context);
        return {};
    }
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
