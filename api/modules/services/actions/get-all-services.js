/**
 * Response handler for services/get-all-services.
 * @module modules/services/actions/get-all-services
 */

// import debugLogger from 'debug-logger';

import { ServiceRepository } from '../repositories';
// import { sendError } from '../../../common/route-utils';
import { GET_ALL_SERVICES } from '../../auth/permissions';
import { validatePermissionsAndSendUnauthorized } from '../../auth';

// const debug = debugLogger('tippiq-places:services:actions:get-all-services');

/**
 * Response handler for getting all services.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissionsAndSendUnauthorized(req, res, GET_ALL_SERVICES)
    .then(() => ServiceRepository.findAllWithImages())
    .then(services => res.json(services.serialize({ context: 'service' })));
}
