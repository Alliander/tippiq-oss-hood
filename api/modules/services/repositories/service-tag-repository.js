/**
 * ServiceTagRepository.
 * @module modules/services/repositories/service-tag-repository
 */

import autobind from 'autobind-decorator';

import { ServiceTag } from '../models';
import BaseRepository from '../../../common/base-repository';
import bookshelf from './../../../common/bookshelf';
import { ValidationError } from './../../../common/errors';

@autobind
/**
 * A Repository for Service tags.
 * @class ServiceTagRepository
 * @extends BaseRepository
 */
export class ServiceTagRepository extends BaseRepository {
  /**
   * Construct a ServiceTagRepository for Service.
   * @constructs ServiceTagRepository
   */
  constructor() {
    super(ServiceTag);
  }

  /**
   * Find non whitelisted tags by serviceId and tagIds
   * @function findNonWhitelistedTags
   * @param {string} serviceId Filter by
   * @param {array} tagIds Check the tag ids
   * @returns {Object} Tag
   */
  findNonWhitelistedTags(serviceId, tagIds) {
    const tagIdsArray = tagIds || [];
    if (!serviceId) {
      throw new ValidationError('ServiceId is undefined');
    }

    return Promise
      .all(tagIdsArray.map(tagId =>
          this.findAll({ tag_id: tagId, service_id: serviceId })
            .then(serviceTags => serviceTags.length < 1 ? tagId : null) // eslint-disable-line
        // no-confusing-arrow
      ))
      .then(nonWhitelistedTags => nonWhitelistedTags.filter(tag => tag !== null));
  }

  /**
   * Find all by where clause
   * @function findAll
   * @param {object} where Filter by
   * @returns {Object} Promise
   */
  findAll(where) {
    const whereObject = where || {};
    return ServiceTag
      .where(whereObject)
      .fetchAll({
        withRelated: ['tag'],
      });
  }

  /**
   * Update tags for service by deleting all tags of a service and then
   * inserting all tags
   * @function updateTagsForService
   * @param {string} serviceId Service to update tags for
   * @param {object} tags Tags to update for this service
   * @return {Object} Promise
   */
  updateTagsForService(serviceId, tags) {
    return this.deleteByService(serviceId)
      .then(() => tags.map(tag => ({ service_id: serviceId, tag_id: tag.id })))
      .then(this.createServiceTags);
  }

  /**
   * Create service tags
   * @function createServiceTags
   * @param {Array} serviceTags Service tags
   * @return {Object} Promise
   */
  createServiceTags(serviceTags) {
    // we need to manually insert record, because Bookshelf expects an id
    return bookshelf.knex
      .insert(serviceTags)
      .into('service_tag_whitelist');
  }

  /**
   * Delete service tags by service id
   * @function deleteByService
   * @param {string} serviceId Service id
   * @return {Object} Promise
   */
  deleteByService(serviceId) {
    return bookshelf.knex('service_tag_whitelist')
      .where({ service_id: serviceId })
      .del();
  }
}

export default new ServiceTagRepository();
