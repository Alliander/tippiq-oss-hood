/**
 * Helper methods for CardRepository.
 * @module modules/cards/repositories/card-repository-utils
 */

import { knex } from '../../../common/bookshelf';

/**
 * build location columns.
 * @function buildLocationColumns
 * @param {Object} geoJson GeoJson object
 * @returns {Array} location columns
 */
function buildLocationColumns(geoJson) {
  const locationColumns = [
    '*',
    knex.st.dutchGeometryToGeoJSON('geometry').as('geometry'),
  ];
  if (geoJson) {
    locationColumns.push(knex.st.distanceBetweenColumnAndGeoJson('geometry', geoJson, 'distance'));
  }
  return locationColumns;
}

/**
 * Get relations for card
 * @function getCardRelations
 * @param {Object} geoJson GeoJson object
 * @returns {Array} relations
 */
function getCardRelations(geoJson) {
  return [
    'tags',
    'images',
    'service',
    'author.images',
    'publisher.images',
    'service.images',
    'service.organization',
    {
      locations: qb => {
        qb.column(buildLocationColumns(geoJson));
      },
    },
  ];
}

/**
 * Get relations for card
 * @function getCardRelations
 * @param {Object} qb QueryBuilder object
 * @param {Array} filters Filters
 * @returns {undefined}
 */
function applyFilters(qb, filters) {
  filters.forEach(filter => qb.where(filter.column, filter.operator, filter.value));
}

/**
 * Get cards by categories
 * @function applyCategoryFilter
 * @param {Object} qb QueryBuilder object
 * @param {Array} categories Categories to filter by
 * @returns {undefined}
 */
function applyCategoryFilter(qb, categories) {
  if (typeof categories !== 'undefined') {
    qb
      .whereExists(function whereExistsQuery() {
        this
          .select('*')
          .from('service')
          .whereIn('service.category', categories)
          .whereRaw('card.service = service.id');
      });
  }
}

/**
 * Get cards by services
 * @function applyServicesFilter
 * @param {Object} qb QueryBuilder object
 * @param {Array} services Services to filter by
 * @returns {undefined}
 */
function applyServiceFilter(qb, services) {
  if (typeof services !== 'undefined') {
    qb.whereIn('service', services);
  }
}

/**
 * Get cards by tag
 * @function applyTagFilter
 * @param {Object} qb QueryBuilder object
 * @param {Array} tags Tags to filter by
 * @returns {undefined}
 */
function applyTagFilter(qb, tags) {
  if (typeof tags !== 'undefined') {
    qb
      .whereExists(function whereExistsQuery() {
        this
          .select('*')
          .from('card_tag')
          .join('tag', 'card_tag.tag', '=', 'tag.id')
          .whereIn('tag.label', tags)
          .whereRaw('card.id = card_tag.card');
      });
  }
}
export {
  getCardRelations,
  applyFilters,
  applyCategoryFilter,
  applyServiceFilter,
  applyTagFilter,
};
