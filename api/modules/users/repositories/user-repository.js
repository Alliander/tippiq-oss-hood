/**
 * UserRepository.
 * @module modules/users/repositories/user-repository
 */

import autobind from 'autobind-decorator';

import { User } from '../models';
import BaseRepository from '../../../common/base-repository';
// import { knex } from '../../../common/bookshelf';

@autobind
/**
 * A Repository for User.
 * @class UserRepository
 * @extends BaseRepository
 */
export class UserRepository extends BaseRepository {
  /**
   * Construct a UserRepository for User.
   * @constructs UserRepository
   */
  constructor() {
    super(User);
  }

  /**
   * Find a User by where clause.
   * @function findOne
   * @param {Object|string} where Bookshelf key/operator/value or attributes hash.
   * @param {Object} [options] Bookshelf options to pass on to fetch.
   * @returns {Promise<User>} A Promise that resolves to a User.
   */
  findOne(where, options = {}) {
    return super.findOne(where, {
      ...options,
      withRelated: ['roles'],
    });
  }

  /**
   * Find or create - try and find the model, create one if not found
   * @param {Object} data User data to find or create
   * @param {Object} options Bookshelf options
   * @returns {Object} User Model of a user
   */
  findOrCreate(data, options) {
    return this.findOne(data, options)
      .catch(this.Model.NotFoundError, () =>
        this.create(data, { ...options, method: 'insert' })
      );
  }
}

export default new UserRepository();
