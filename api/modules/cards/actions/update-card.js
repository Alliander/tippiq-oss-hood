/**
 * Response handler for update cards.
 * @module cards/actions/update-card
 */

import debugLogger from 'debug-logger';
import CardRepository from '../repositories/card-repository';
import Card from './../models/card-model';
import validateCard from '../card-validation';
import { ValidationError } from './../../../common/errors';
import { validatePermissionsAndSendUnauthorized, ROLES } from '../../auth';
import permissions from '../../auth/permissions';
import { sendError } from '../../../common/route-utils';

const debug = debugLogger('tippiq-hood:cards:actions:update-card');

/**
 * Response handler for update cards
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  debug.trace('Update card');
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
      validatePermissionsAndSendUnauthorized(req, res, permissions.UPDATE_CARD, localRoles))
    .then(() => CardRepository.findById(req.params.id))
    .then(existingCard => {
      const cardJson = req.body;
      if (!cardJson.publishedAt) {
        cardJson.publishedAt = existingCard.get('publishedAt');
      }
      cardJson.updatedAt = new Date().toISOString();

      return validateCard(cardJson, req.user)
        .then(validatedCardJson => CardRepository
          .updateCardWithId(existingCard.id, validatedCardJson, req.user));
    })
    .then(card => CardRepository.findCardById(card.attributes.id))
    .then(card => {
      res.json(card.serialize({ context: 'card' }));
    })
    .catch(Card.NotFoundError, () => {
      sendError(res, 404, `Card met id ${req.params.id} niet gevonden.`);
    })
    .catch(ValidationError, (e) => {
      debug.warn(`Error update card: ${e.message} ${e.stack}`);
      sendError(res, 400, `Validatiefout: ${e.message}.`);
    })
    .catch(e => {
      debug.warn(`Error update card: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}
