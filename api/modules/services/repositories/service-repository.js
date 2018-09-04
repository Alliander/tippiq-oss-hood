/**
 * ServiceRepository.
 * @module modules/services/repositories/service-repository
 */

import autobind from 'autobind-decorator';

import { Service } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for Service.
 * @class ServiceRepository
 * @extends BaseRepository
 */
export class ServiceRepository extends BaseRepository {
  /**
   * Construct a ServiceRepository for Service.
   * @constructs ServiceRepository
   */
  constructor() {
    super(Service);
  }

  /**
   * Find all with images
   * @function findAllWithImages
   * @param {where} where clause
   * @returns {Object} promise
   */
  findAllWithImages(where = {}) {
    return this.Model
      .where(where)
      .fetchAll({
        withRelated: ['images'],
      });
  }
}

export default new ServiceRepository();
