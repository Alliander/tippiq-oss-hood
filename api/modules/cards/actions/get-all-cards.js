/**
 * Response handler for get all cards.
 * @module cards/actions/get-all-card
 */

import debugLogger from 'debug-logger';
import { CardRepository } from '../repositories';
import auth from '../../auth';
import permissions from '../../auth/permissions';
import { TYPES as filterTypes, SearchFilter } from '../../../common/search-filter';
import { sendError } from '../../../common/route-utils';

const debug = debugLogger('tippiq-hood:cards:actions:get-all-cards');
const DEFAULTS = Object.freeze({
  PAGE_NUMBER: 0,
  PAGE_SIZE: 50,
});

/**
 * Create SearchFilter from filters
 * @function createSearchFiltersWithType
 * @param {Array} filters Array of filters
 * @param {string} type Filter type
 * @returns {Array} searchFilters
 */
function createSearchFiltersWithType(filters, type) {
  return filters
    .filter(filter => typeof filter.value !== 'undefined')
    .map(filter => new SearchFilter(filter.column, filter.value, type));
}

/**
 * Create SearchFilters from query
 * @function createSearchFiltersFromQuery
 * @param {Object} query Request query object
 * @returns {Array} searchFilters
 */
function createSearchFiltersFromQuery(query) {
  const equalQueries = [
    { column: 'document_type', value: query.documentType },
    { column: 'external_id', value: query.externalId },
    { column: 'service', value: query.serviceId },
    { column: 'author_id', value: query.authorId },
    { column: 'publisher_id', value: query.publisherId },
  ];

  const searchQueries = [
    { column: 'title', value: query.title },
    { column: 'description', value: query.description },
  ];

  const dateQueries = [
    { column: 'start_date', value: query.startDate },
    { column: 'end_date', value: query.endDate },
    { column: 'published_at', value: query.publishedAt },
    { column: 'expires_at', value: query.expiresAt },
    { column: 'created_at', value: query.createdAt },
    { column: 'updated_at', value: query.updatedAt },
  ];

  return [
    ...createSearchFiltersWithType(equalQueries, filterTypes.EXACT_MATCH),
    ...createSearchFiltersWithType(searchQueries, filterTypes.SEARCH),
    ...createSearchFiltersWithType(dateQueries, filterTypes.DATE),
  ];
}

/**
 * Create SearchFilters from query
 * @function fetchCards
 * @param {Array} searchFilters object
 * @param {Object} category tags Categories and Tags
 * @param {number} pageNumber Page number
 * @param {number} pageSize Page size
 * @returns {Array} searchFilters
 */
function fetchCards(searchFilters, { category, service, tags },
    pageNumber = DEFAULTS.PAGE_NUMBER,
    pageSize = DEFAULTS.PAGE_SIZE) {
  return CardRepository.findAll(searchFilters, pageNumber * pageSize, pageSize, {
    category,
    service,
    tags,
  });
}


/**
 * Check and set for array of items or make array
 * @function checkAndSetValueType
 * @param {(string|string[])} value Value or array of values.
 * @returns {undefined}
 */
function checkAndSetValueType(value) {
  return typeof value === 'string' ? [value] : value;
}

/**
 * Response handler for get all cards
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  auth
    .validatePermissionsAndSendUnauthorized(req, res, permissions.GET_CARDS)
    .then(() => fetchCards(
      createSearchFiltersFromQuery(req.query),
      {
        category: checkAndSetValueType(req.query.category),
        service: checkAndSetValueType(req.query.service),
        tags: checkAndSetValueType(req.query.tag),
      },
      req.query.page,
      req.query.pageSize)
    )
    .then(cards => res.json(cards.serialize({ context: 'card' })))
    .catch(e => {
      debug(e);
      sendError(res, 500, 'Serverfout.');
    });
}
