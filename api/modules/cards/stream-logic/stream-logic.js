/**
 * Stream logic
 * @module cards/stream-logic/stream-logic
 */

import debugLogger from 'debug-logger';

import {
  STANDARD_SCORE_COLUMNS,
  cardsWithMetadataColumns,
  relevanceScoreColumn,
  scoresObjectColumn,
  ageColumn,
  filteredCards,
} from './stream-util';
import bookshelf from '../../../common/bookshelf';

const knex = bookshelf.knex;
const allowedSortModes = ['new', 'distance', 'standard', 'diversify', 'theme'];
const debug = debugLogger('tippiq-hood:modules:cards:stream-logic');
const queryDebug = debugLogger('tippiq-hood:modules:cards:stream-logic:query');

/**
 * Get sort mode
 * @function getSortMode
 * @param {string} sort Desired sort mode
 * @returns {string} Sort mode
 */
function getSortMode(sort) {
  return allowedSortModes.indexOf(sort) > -1 ? sort : 'standard';
}

/**
 * Get stream of cards
 * @function cardStream
 * @param {Object} geoJson Address
 * @param {string} sort Sorting method
 * @param {number} limit Max results
 * @param {Object} userPlace UserPlace context
 * @returns {Array} Card stream
 */
export function cardStream(geoJson, sort, limit, userPlace) {
  const sortMode = getSortMode(sort);
  const userId = userPlace ? userPlace.get('userId') : null;

  return function QueryBuilder(qb) { // eslint-disable-line complexity
    qb.select('*');

    switch (sortMode) {
      case 'new':
        qb
          .from(filteredCards(geoJson, userId, 'card'))
          .column([
            ageColumn().as('age'),
          ])
          .orderBy('age', 'asc');
        break;

      case 'distance':
        qb.from(filteredCards(geoJson, userId, 'card'));
        break;

      case 'standard':
        qb
          .from(cardsWithMetadataColumns(
            geoJson,
            userId,
            'distance',
            'new_score',
            'start_score',
            'continuous_score',
            'distance_score',
            'location_within_score',
            'same_service_diversity_score',
          ).as('card'))
          .column([
            scoresObjectColumn(STANDARD_SCORE_COLUMNS).as('scores'),
            relevanceScoreColumn(STANDARD_SCORE_COLUMNS).as('relevance_score'),
          ])
          .orderBy('relevance_score', 'desc');
        break;

      case 'theme':
        qb
          .from(function cardRankedByAgeInTheme() {
            this.from(
              function cardRankedByAgeInService() {
                this
                  .from(filteredCards(geoJson, userId, 'card_by_user'))
                  .join('service', 'card_by_user.service', 'service.id')
                  .columns([
                    knex.raw('? - ??', ['now', 'card_by_user.created_at']).as('card_age'),
                    'service.name as service_name',
                    'service.category as theme_name',
                    knex.raw('row_number() OVER (PARTITION BY ??, ?? ORDER BY ?? DESC)', [
                      'service.category', 'service.name', 'card_by_user.created_at',
                    ]).as('service_rank'),
                    'card_by_user.*',
                  ])
                  .orderBy('service_rank')
                  .as('card_ranked_by_age_in_service');
              })
              .column([
                knex.raw('row_number() OVER (PARTITION BY ?? ORDER BY ??, ?? DESC)', [
                  'card_ranked_by_age_in_service.theme_name',
                  'card_ranked_by_age_in_service.service_rank',
                  'card_ranked_by_age_in_service.created_at',
                ]).as('theme_rank'),
                knex.raw('min(??) OVER (PARTITION BY ?? ORDER BY ??, ?? DESC)', [
                  'card_ranked_by_age_in_service.card_age',
                  'card_ranked_by_age_in_service.theme_name',
                  'card_ranked_by_age_in_service.service_rank',
                  'card_ranked_by_age_in_service.created_at',
                ]).as('theme_age'),
                '*',
              ])
              .as('card_ranked_by_age_in_theme');
          })
          .where('theme_rank', '<=', 2)
          .orderBy('theme_age', 'asc');
        break;

      case 'diversify':
        qb
            .from(function SelectQuery() {
              this
                .select('*')
                .from(
                  cardsWithMetadataColumns(
                    geoJson,
                    userId,
                    'distance',
                    'new_score',
                    'start_score',
                    'continuous_score',
                    'distance_score',
                    'location_within_score',
                    'same_service_diversity_score',
                  ).as('card_with_scores'))
                .column([
                  relevanceScoreColumn(STANDARD_SCORE_COLUMNS).as('relevance_score'),
                ]).as('card');
            })
            .column([
              knex.raw('row_number() OVER (PARTITION BY "service" ORDER BY "relevance_score" DESC)',
                []).as('position_by_relevance_and_distance_within_service'),
            ])
            .orderBy('position_by_relevance_and_distance_within_service', 'asc')
            .orderBy('relevance_score', 'desc');
        break;

      default:
        debug(`Unknown sort mode for the card stream, ${sortMode}.`);
        throw new Error('Invalid sort mode.');
    }
    qb.orderBy('distance', 'asc').limit(limit);

    queryDebug.trace(qb.toString());
  };
}
