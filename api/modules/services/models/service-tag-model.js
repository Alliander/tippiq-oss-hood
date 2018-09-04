/**
 * ServiceTagModel.
 * @module modules/services/models/service-tag-model
 */

import debugLogger from 'debug-logger';
import { chain } from 'lodash';
import BaseModel from '../../../common/base-model';

import Service from './service-model';
import Tag from '../../tags/models/tag-model';

const debug = debugLogger('tippiq-hood:services-tag:model');

const instanceProps = {
  tableName: 'service_tag_whitelist',
  serialize(options = {}) {
    switch (options.context) {
      case 'tag':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['tag_id'])
          .value();

      default:
        debug('serialization context \'%s\' unknown', options.context);
        return {};
    }
  },
  service() {
    return this.belongsTo(Service, 'service_id');
  },
  tag() {
    return this.belongsTo(Tag, 'tag_id');
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
