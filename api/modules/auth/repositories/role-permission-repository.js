/**
 * RolePermissionRepository.
 * @module modules/auth/repositories/role-permission-repository
 */
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { RolePermission } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
  /**
   * A Repository for RolePermission.
   * @class RolePermissionRepository
   * @extends BaseRepository
   */
class RolePermissionRepository extends BaseRepository {
  /**
   * Construct a RolePermissionRepository for RolePermission.
   * @constructs RolePermissionRepository
   */
  constructor() {
    super(RolePermission);
  }

  /**
   * Find all roles by permission.
   * @function findRolesByPermission
   * @param {string} permission Permission to find roles for
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of roles.
   */
  findRolesByPermission(permission) {
    return this.findAll({ permission });
  }

  /**
   * Create role permission
   * @function createRolePermission
   * @param {object} rolePermissionJson Role permission object
   * @return {Promise} A promise that resolves to a saved role permission
   */
  createRolePermission(rolePermissionJson) {
    const rolePermissionRecordJson =
      this.rolePermissionRecordJsonFromRolePermissionJson(rolePermissionJson);

    return new RolePermission(rolePermissionRecordJson).save(null, { method: 'insert' });
  }

  /**
   * Role permission record Json from Role Permission Json
   * @function rolePermissionRecordJsonFromRolePermissionJson
   * @param {object} inputObj Role permission json
   * @return {object} Role permission record Json
   */
  rolePermissionRecordJsonFromRolePermissionJson(inputObj) {
    return _.pick(inputObj,
      'role',
      'permission');
  }
}

export default new RolePermissionRepository();
