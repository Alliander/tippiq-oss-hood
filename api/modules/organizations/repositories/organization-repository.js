/**
 * OrganizationRepository.
 * @module modules/organizations/repositories/organization-repository
 */

import autobind from 'autobind-decorator';

import { Organization } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for organizations.
 * @class OrganizationRepository
 * @extends BaseRepository
 */
export class OrganizationRepository extends BaseRepository {
  /**
   * Construct a OrganizationRepository for an Organization.
   * @constructs OrganizationRepository
   */
  constructor() {
    super(Organization);
  }
}

export default new OrganizationRepository();
