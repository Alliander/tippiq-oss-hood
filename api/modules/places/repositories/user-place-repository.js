/**
 * UserPlaceRepository.
 * @module modules/places/repositories/user-place-repository
 */

import autobind from 'autobind-decorator';

import { knex } from '../../../common/bookshelf';
import { UserPlace } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for UserPlace.
 * @class UserPlaceRepository
 * @extends BaseRepository
 */
export class UserPlaceRepository extends BaseRepository {
  /**
   * Construct a UserPlaceRepository for UserPlace.
   * @constructs UserPlaceRepository
   */
  constructor() {
    super(UserPlace);
  }

  /**
   * Find or create - try and find the model, create one if not found
   * Only creates with placeId and userId attributes. Necessary because finding needs
   * snake case and returns attributes in camel case while creating a model with snake case works,
   * it returns in snake case(!), you would expect camel case.
   * @param {Object} data UserPlace data to find or create
   * @param {Object} options Bookshelf options
   * @returns {Object} UserPlace model
   */
  findOrCreate(data, options) {
    return this.findOne(data, options)
      .catch(this.Model.NotFoundError, () =>
        this.create({ userId: data.user_id, placeId: data.place_id }, options)
      );
  }

  /**
   * Find Users subscribed to the newsletter.
   * @function findAllNewsletterSubscribers
   * @returns {Promise<Array>} A Promise that resolves to a collection of Users.
   */
  findAllNewsletterSubscribers() {
    return this.Model
      .query(qb =>
        qb
          .where('email_notifications_enabled', true)
          .where('email_last_sent_at', '<', knex.raw("current_date - (? * interval '1 day')", [6]))
      )
      .orderBy('email_last_sent_at')
      .fetchAll();
  }
}

export default new UserPlaceRepository();
