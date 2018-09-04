/**
 * Response handler for add cards.
 * @module cards/actions/add-card
 */

import debugLogger from 'debug-logger';
import BPromise from 'bluebird';

import CardRepository from '../repositories/card-repository';
import { TagRepository } from '../../tags/repositories';
import Tag from '../../tags/models/tag-model';

import { ServiceTagRepository } from './../../services/repositories';
import validateCard from '../card-validation';
import Card from './../models/card-model';
import { AddressLookupError, ValidationError } from './../../../common/errors';
import auth from '../../auth';
import permissions from '../../auth/permissions';
import { sendError, sendCreated, catchResourceNotFoundError } from '../../../common/route-utils';

const debug = debugLogger('tippiq-hood:cards:actions:add-card');

/**
 * Response handler for add cards
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  debug.trace('Add card');
  auth
    .validatePermissionsAndSendUnauthorized(req, res, permissions.ADD_CARD)
    .then(() => {
      const cardJson = req.body;
      BPromise.resolve(cardJson.tags)
        .map(tagLabel => TagRepository.findByLabel(tagLabel))
        .map(tagModel => tagModel.get('id'))
        .then(tagIds => ServiceTagRepository.findNonWhitelistedTags(cardJson.serviceId, tagIds))
        .then(nonWhitelistedTags => {
          if (cardJson.tags.length > 0 && nonWhitelistedTags.length > 0) {
            throw new ValidationError('Some of the specified tags are not whitelisted for the service of this card.');
          }
        })
        .then(() => {
          if (!cardJson.externalId) {
            throw new ValidationError('External Id is required');
          }
          return CardRepository.findByExternalId(cardJson.externalId);
        })
        .then(existingCard => {
          if (!cardJson.publishedAt) {
            cardJson.publishedAt = existingCard.get('publishedAt');
          }
          cardJson.updatedAt = new Date().toISOString();
          return validateCard(cardJson, req.user)
            .then((validatedCardJson) =>
              CardRepository.updateCardWithId(existingCard.id, validatedCardJson, req.user)
            );
        })
        .catch(Tag.NotFoundError, () => {
          throw new ValidationError('Some of the specified tags don\'t exist.');
        })
        .catch(Card.NotFoundError, () => {
          if (!cardJson.publishedAt) {
            cardJson.publishedAt = new Date().toISOString();
          }
          return validateCard(cardJson, req.user)
            .then(CardRepository.createCard);
        })
        .then(card => (
          sendCreated(res, card.id)
        ))
        .catch(e => (
          catchResourceNotFoundError(res, e)
        ))
        .catch(ValidationError, (e) => {
          debug.warn(`Error add card: ${e.message} ${e.stack}`);
          sendError(res, 400, `Validatiefout: ${e.message}.`);
        })
        .catch(AddressLookupError, (e) => (
          sendError(res, 400, `Adres zoekfout:  ${e.message}.`)
        ))
        .catch(e => {
          debug.warn(`Error add card: ${e.message} ${e.stack}`);
          sendError(res, 500, 'Serverfout.');
        });
    });
}
