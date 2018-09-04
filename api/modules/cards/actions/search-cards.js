/**
 * Search cards response handler
 * @module cards/actions/search-cards
 */

import debugLogger from 'debug-logger';
import { CardRepository } from '../repositories';
import auth from '../../auth';
import permissions from '../../auth/permissions';
import { sendError } from '../../../common/route-utils';

const debug = debugLogger('tippiq-hood:cards:actions:search-cards');
const DEFAULTS = Object.freeze({
  STREAM_PAGE_SIZE: 50,
});

/**
 * Response handler for search cards
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  auth
    .validatePermissionsAndSendUnauthorized(req, res, permissions.SEARCH_CARD)
    .then(() => {
      if (!req.body.geometry) {
        return sendError(res, 400, 'Geometrie info vereist.');
      }

      const geometry = req.body.geometry;
      const sort = req.query.sort;
      const tags = typeof req.query.tag === 'string' ? [req.query.tag] : req.query.tag;
      const services = typeof req.query.service === 'string' ? [req.query.service] : req.query.service;

      return CardRepository
        .findAllNear(geometry, sort, DEFAULTS.STREAM_PAGE_SIZE, req.user, tags, services)
        .then(cards => {
          res.json(cards.serialize({ context: 'card-stream' }));
        })
        .catch(e => {
          debug(e);
          sendError(res, 500, 'Serverfout.');
        });
    });
}
