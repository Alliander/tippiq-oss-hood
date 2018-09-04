/**
 * Response handler for addresses/search.
 * @module modules/addresses/actions/search
 */

import { TimeoutError } from 'bluebird';
import debugLogger from 'debug-logger';

import { search } from './../../../addressesMicroservice';
import { sendError } from '../../../common/route-utils';

const debug = debugLogger('tippiq-hood:addresses:actions:search');

/**
 * Response handler for getting addresses suggestions.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  search(req.query.query)
    .then(result => {
      res.json(result);
    })
    .catch(TimeoutError, err => {
      debug.debug({ err });
      sendError(res, 504, 'Tijd overschreden.');
    })
    .catch(err => {
      debug.warn({ err });
      sendError(res, 400, 'Foutieve aanvraag.');
    });
}
