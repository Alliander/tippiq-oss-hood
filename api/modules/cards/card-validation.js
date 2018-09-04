/**
 * Card validation.
 * @module cards/card-validation
 */

import BPromise from 'bluebird';
import _ from 'lodash';

import { Card } from './models';
import { ValidationError } from './../../common/errors';
import { CardRepository } from './repositories';
import { ServiceRepository } from './../services/repositories';
import { Service } from './../services/models';
import { OrganizationRepository } from './../organizations/repositories';
import { Organization } from './../organizations/models';
import {
  isValidUUID,
  isValidDocumentPropertyFormat,
  isValidImagePropertyFormat,
  validateFieldExistsAndHasLengthBetween,
} from './../../common/validation-utils';

/**
 * Validates the parent id
 * @function validateParentId
 * @param {object} cardObject The card to validate
 * @return {object} Card
 */
function validateParentId(cardObject) { // eslint-disable-line complexity
  const card = cardObject;
  if (card.parentId === '') {
    card.parentId = null;
    return BPromise.resolve(card);
  }
  if (typeof card.parentId === 'undefined' || card.parentId === null || card.parentId === '') {
    return BPromise.resolve(card);
  }

  if (!isValidUUID(card.parentId)) {
    throw new ValidationError('Invalid parentId: parentId is not a valid UUID.');
  }
  return CardRepository
    .findById(card.parentId)
    .return(card)
    .catch(Card.NotFoundError, () => {
      throw new ValidationError(`parentId ${card.parentId} doesn\'t exist`);
    });
}

/**
 * Validates the external id
 * @function validateExternalId
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateExternalId(card) {
  validateFieldExistsAndHasLengthBetween(card.externalId, 'externalId', 1, 255);
  return BPromise.resolve(card);
}

/**
 * Validates card title
 * @function validateTitle
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateTitle(card) {
  validateFieldExistsAndHasLengthBetween(card.title, 'title', 1, 500);
  return BPromise.resolve(card);
}

/**
 * Validates card description
 * @function validateDescription
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateDescription(card) {
  validateFieldExistsAndHasLengthBetween(card.description, 'description', 1, 5000);
  return BPromise.resolve(card);
}

/**
 * Validates card locations
 * @function validateLocations
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateLocations(card) {
  if (typeof card.locations === 'undefined') {
    throw new ValidationError('Invalid locations: at least one location should be specified.');
  }
  if (!_.isArray(card.locations)) {
    throw new ValidationError('The card contains invalid locations: locations should be an array.');
  }
  if (card.locations.length < 1) {
    throw new ValidationError('Invalid locations: at least one location should be specified.');
  }
  const everyLocationHasAddressOrGeometry = card.locations.every((location) =>
    !(typeof location.address === 'undefined' && typeof location.geometry === 'undefined')
  );
  if (!everyLocationHasAddressOrGeometry) {
    throw new ValidationError('Every location should have either an address or geometry set, or both.');
  }
  return BPromise.resolve(card);
}

/**
 * Validates card tags
 * @function validateTags
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateTags(card) {
  if (card.tags === null) {
    throw new ValidationError('Invalid tags: tags should be an array.');
  }
  if (!_.isArray(card.tags)) {
    throw new ValidationError('The card contains invalid tags: tags should be an array.');
  }
  return BPromise.resolve(card);
}

/**
 * Validates card images
 * @function validateImages
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateImages(card) {
  if (card.images === null) {
    throw new ValidationError('Invalid images: images should be an object.');
  }
  if (typeof card.images !== 'object') {
    throw new ValidationError('Invalid images: images should be an object');
  }
  if (typeof card.images !== 'object') {
    throw new ValidationError('Invalid images: images should be an object');
  }
  const keysOfInvalidImages = Object.keys(card.images).filter(key =>
    !isValidImagePropertyFormat(key) ||
    typeof card.images[key] !== 'string' ||
    card.images[key].length === 0
  );
  if (keysOfInvalidImages.length > 0) {
    throw new ValidationError(`Invalid images: ${keysOfInvalidImages.join(', ')}`);
  }
  return BPromise.resolve(card);
}

/**
 * Validates card dates
 * @function validateDates
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateDates(card) {
  if (Date.parse(card.startDate) >= Date.parse(card.endDate)) {
    throw new ValidationError('The endDate cannot be equal to or smaller than the startDate.');
  }
  if (Date.parse(card.publishedAt) >= Date.parse(card.expiresAt)) {
    throw new ValidationError('The publishedAt cannot be equal to or smaller than the expiresAt');
  }
  return BPromise.resolve(card);
}

/**
 * Validates card author
 * @function validateAuthor
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateAuthor(card) {
  if (typeof card.authorId === 'undefined') {
    throw new ValidationError('Invalid authorId: authorId is a required field.');
  }
  if (!isValidUUID(card.authorId)) {
    throw new ValidationError('Invalid authorId: authorId is not a valid UUID.');
  }
  return OrganizationRepository
    .findById(card.authorId)
    .then(() => BPromise.resolve(card))
    .catch(Organization.NotFoundError, () => {
      throw new ValidationError(`Invalid authorId: authorId ${card.authorId} doesn\'t exist`);
    });
}

/**
 * Validates card publisher
 * @function validatePublisher
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validatePublisher(card) {
  if (typeof card.publisherId === 'undefined') {
    throw new ValidationError('Invalid publisherId: publisherId is a required field.');
  }
  if (!isValidUUID(card.publisherId)) {
    throw new ValidationError('Invalid publisherId: publisherId is not a valid UUID.');
  }
  return OrganizationRepository
    .findById(card.publisherId)
    .then(() => BPromise.resolve(card))
    .catch(Organization.NotFoundError, () => {
      throw new ValidationError(`Invalid publisherId: publisherId ${card.publisherId} doesn\'t exist`);
    });
}

/**
 * Validates the document type
 * @function validateDocumentType
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateDocumentType(card) {
  validateFieldExistsAndHasLengthBetween(card.documentType, 'documentType', 1, 60);
  return BPromise.resolve(card);
}

/**
 * Validates card document
 * @function validateDocument
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateDocument(card) {
  if (card.document === null) {
    throw new ValidationError('Invalid document: document should be an object.');
  }
  if (typeof card.document !== 'object') {
    throw new ValidationError('Invalid document: document should be an object');
  }
  const invalidDocumentKeys = Object.keys(card.document).filter((key) =>
    !isValidDocumentPropertyFormat(key));
  if (invalidDocumentKeys.length > 0) {
    throw new ValidationError(`Invalid document properties: ${invalidDocumentKeys.join(', ')}`);
  }
  return BPromise.resolve(card);
}

/**
 * Validates card owner
 * @function validateOwner
 * @param {object} cardObject The card to validate
 * @param {object} userModel The user model to validate against
 * @return {object} Card
 */
function validateOwner(cardObject, userModel) {
  if (typeof userModel === 'undefined' || userModel === null) {
    throw new ValidationError('Invalid authorization: you don\'t have the right permissions.');
  }
  const card = cardObject;
  card.owner = userModel.get('id');
  return BPromise.resolve(card);
}

/**
 * Validates card title
 * @function validateTitle
 * @param {object} card The card to validate
 * @return {object} Card
 */
function validateService(card) {
  if (typeof card.serviceId === 'undefined') {
    throw new ValidationError('Invalid serviceId: serviceId is a required field.');
  }
  if (!isValidUUID(card.serviceId)) {
    throw new ValidationError('Invalid serviceId: serviceId is not a valid UUID.');
  }
  return ServiceRepository
    .findById(card.serviceId)
    .then(() => BPromise.resolve(card))
    .catch(Service.NotFoundError, () => {
      throw new ValidationError(`Invalid serviceId: service with id ${card.serviceId} doesn\'t exist`);
    });
}

/**
 * Validates the card
 * @function validateCard
 * @param {object} card The card to validate
 * @param {object} userModel The user model to validate the owner with
 * @return {object} Card
 */
export default function validateCard(card, userModel) {
  return BPromise.resolve(card)
    .tap(validateParentId)
    .tap(validateExternalId)
    .tap(validateTitle)
    .tap(validateDescription)
    .tap(validateLocations)
    .tap(validateTags)
    .tap(validateImages)
    .tap(validateDates)
    .tap(validateAuthor)
    .tap(validatePublisher)
    .tap(validateDocumentType)
    .tap(validateDocument)
    .tap(validateService)
    .tap(cardOwnerCheck => (validateOwner(cardOwnerCheck, userModel)));
}
