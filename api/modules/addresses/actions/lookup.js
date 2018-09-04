/**
 * Response handler for addresses lookup.
 * @module modules/addresses/actions/lookup
 */

import request from 'superagent';
import debugLogger from 'debug-logger';

import config from '../../../config';
import { sendError } from '../../../common/route-utils';

const addressesUrl = `${config.tippiqAddressesBaseUrl}/api/addresses`;
const debug = debugLogger('tippiq-hood:addresses:actions:lookup');

/**
 * Response handler for looking up addresses.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  request
    .get(`${addressesUrl}/lookup?name=${req.query.name}&type=${req.query.type}`)
    .then(result => res.send(result.body))
    .catch(e => {
      debug(e);
      sendError(res, 500, 'Serverfout.');
    });
}
