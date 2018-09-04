/**
 * UserModel.
 * @module modules/users/models/user-model
 */

import debugLogger from 'debug-logger';
import { chain, includes } from 'lodash';

import BaseModel from '../../../common/base-model';
import { RoleCollection } from '../../auth/collections';
import { UserPlace } from '../../places/models';

const debug = debugLogger('tippiq-hood:users:model');

const instanceProps = {
  tableName: 'user',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'newsletter':
        return chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'id',
            'userPlaces',
          ])
          .value();
      default:
        debug('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
  userPlaces() {
    return this.hasMany(UserPlace);
  },
  roles() {
    return this.belongsToMany(RoleCollection, 'user_role', 'user', 'role');
  },
  hasRole(role) {
    const userRoles = this.related('roles').toJSON();
    return includes(userRoles.map(r => r.name), role);
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
