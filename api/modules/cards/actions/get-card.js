/**
 * Response handler for get card.
 * @module cards/actions/get-card
 */

import debugLogger from 'debug-logger';

import CardRepository, { Card } from '../repositories/card-repository';
import auth from '../../auth';
import permissions from '../../auth/permissions';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';

const debug = debugLogger('tippiq-hood:cards:actions:get-card');

/**
 * Response handler for get card
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  auth
    .validatePermissionsAndSendUnauthorized(req, res, permissions.GET_CARD)
    .then(() => CardRepository.findCardById(req.params.id))
    .then(card => {
      res.json(card.serialize({ context: 'card' }));
    })
    .catch(Card.NotFoundError, () => {
      sendError(res, 404, 'Niet gevonden.');
    })
    .catch(e => {
      catchInvalidUUIDError(res, e);
    })
    .catch(e => {
      debug(e);
      sendError(res, 500, 'Serverfout.');
    });
}
