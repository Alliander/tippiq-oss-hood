/**
 * Response handler for delete cards.
 * @module cards/actions/add-card
 */

import debugLogger from 'debug-logger';

import Card from './../models/card-model';
import CardRepository from '../repositories/card-repository';

import {
  sendSuccess,
  sendError,
  catchInvalidUUIDError,
} from './../../../common/route-utils';
import { validatePermissionsAndSendUnauthorized, ROLES } from '../../auth';
import permissions from '../../auth/permissions';

const debug = debugLogger('tippiq-hood:cards:card-routes:delete-card');

/**
 * Response handler for delete card
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const userId = req.user ? req.user.get('id') : undefined;

  CardRepository
    .findById(req.params.id)
    .then(card => {
      const localRoles = [];

      if (card.get('owner') === userId) {
        localRoles.push(ROLES.OWNER);
      }

      return localRoles;
    })
    .then(localRoles =>
      validatePermissionsAndSendUnauthorized(req, res, permissions.DELETE_CARD, localRoles)
    )
    .then(() => CardRepository.deleteById(req.params.id))
    .then(() => {
      sendSuccess(res, 200, `Kaartje met id ${req.params.id} verwijderd.`);
    })
    .catch(Card.NotFoundError, () => {
      sendError(res, 404, 'Niet gevonden.');
    })
    .catch(err => {
      catchInvalidUUIDError(res, err);
    })
    .catch(err => {
      debug(err);
      sendError(res, 500, 'Serverfout.');
    });
}
