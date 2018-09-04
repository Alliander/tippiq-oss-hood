/**
 * UserPlaceModel.
 * @module modules/places/models/user-place-model
 */

import debugLogger from 'debug-logger';
import { chain } from 'lodash';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-hood:places:model');

const instanceProps = {
  tableName: 'user_place',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'user-place':
      case 'newsletter':
        return chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'userId',
            'placeId',
            'location',
            'locationUpdatedAt',
            'placeAccessToken',
            'email_notifications_enabled',
            'email_last_sent_at',
          ])
          .value();
      default:
        debug('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
