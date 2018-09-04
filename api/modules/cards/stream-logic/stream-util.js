/**
 * Stream util
 * @module cards/stream-logic/stream-util
 */

import { camelCase } from 'lodash';
import debugLogger from 'debug-logger';
import bookshelf from '../../../common/bookshelf';
import config from '../../../config';

const knex = bookshelf.knex;
const debug = debugLogger('tippiq-hood:modules:cards:stream-logic:columns-util');

const SAME_SERVICE_DIVERSITY_COLUMNS = [
  'new_score',
  'start_score',
  'continuous_score',
  'distance_score',
  'location_within_score',
];
export const STANDARD_SCORE_COLUMNS = SAME_SERVICE_DIVERSITY_COLUMNS
  .concat(['same_service_diversity_score']);

const streamLogicConfig = Object.assign(
  {},
  config.streamLogic,
  {
    continuous: {
      nonContinuousScore: 0,
      continuousPublicationThreshold: 7,
      continuousPrePublicationThresholdScore: -1,
      continuousPostPublicationThresholdScore: 0,
    },
  });
debug.trace('%j', { streamLogicConfig });

/**
 * Cast as float
 * @function castAsFloat
 * @param {string} column Column name
 * @returns {Object} Knex object
 */
function castAsFloat(column) {
  return knex.raw('cast(? as real)', [column]);
}

/**
 * New score column
 * @function newScoreColumn
 * @param {[string]} ageLessThan Timespan
 * @param {[number]} newScoreValue New score value
 * @param {[number]} nonNewScoreValue Non new score value
 * @returns {Object} Knex object
 */
function newScoreColumn(ageLessThan = '1 day', newScoreValue = 7, nonNewScoreValue = 0) {
  return castAsFloat(
    knex.raw('case when age("published_at") < ? then ? else ? end',
      [ageLessThan, newScoreValue, nonNewScoreValue])
  );
}

/**
 * Cards that have a start_date in the near future get a higher score.
 * @function startingSoonScoreColumn
 * @param {[number]} alreadyStartedScoreValue Already started score value
 * @param {[number]} startingSoonUpperLimit Starting soon upper limit
 * @param {[number]} startingSoonLowerLimit Starting soon lower limit
 * @returns {Object} Knex object
 */
function startingSoonScoreColumn(alreadyStartedScoreValue = 0, startingSoonUpperLimit = 7,
                                 startingSoonLowerLimit = 0) {
  return knex
    .raw(`
      case
      when "start_date" >= current_date 
        then greatest(
          ? - (
            date_part('epoch', date_trunc('day', "start_date") - current_date) / 
            date_part('epoch', '1 day' :: INTERVAL)
          ),
          ?)
        else ?
      end
      `,
      [startingSoonUpperLimit, startingSoonLowerLimit, alreadyStartedScoreValue]
    );
}

/**
 * Assign a score to cards that have no expiration date
 * @function continuousScoreColumn
 * @returns {Object} Knex object
 */
function continuousScoreColumn() {
  return castAsFloat(knex.raw(`
    case 
      when "expires_at" IS NOT NULL then ? 
      when "published_at" < (current_date - (? * interval '1 day')) then ?
      else ?
    end`,
    [
      streamLogicConfig.continuous.nonContinuousScore,
      streamLogicConfig.continuous.continuousPublicationThreshold,
      streamLogicConfig.continuous.continuousPrePublicationThresholdScore,
      streamLogicConfig.continuous.continuousPostPublicationThresholdScore,
    ]));
}


/**
 * Cards that are near to the location that is searched for get a higher score.
 * Except the cards that cover the location these get their score from locationWithinScoreColumn
 * @function distanceScoreColumn
 * @param {[string]} distanceColumnName Distance column name
 * @param {[number]} zeroDistanceScore Zero distance score
 * @param {[number]} distanceStepUnit Distance step unit
 * @param {[number]} defaultDistanceScore Default distance score
 * @returns {Object} Knex object
 */
function distanceScoreColumn(distanceColumnName = 'distance',
                             zeroDistanceScore = 0,
                             distanceStepUnit = 1000,
                             defaultDistanceScore = 1) {
  return castAsFloat(knex.raw('case when ?? = 0 then ? else coalesce(10-(??/?),?) end', [
    distanceColumnName,
    zeroDistanceScore,
    distanceColumnName,
    distanceStepUnit,
    defaultDistanceScore,
  ]));
}

/**
 * These scores can be made more individual by incorporating them into the
 * user_service_max_distance and service relations.
 * @function locationWithinScoreColumn
 * @param {[string]} distanceColumnName Distance column name
 * @param {[string]} locationTypeColumnName Locationtype column name
 * @param {[number]} notWithinLocationScore Not within location score
 * @param {[number]} houseAddressScore House address score
 * @param {[number]} zipcode6AddressScore Zipcode6 address score
 * @param {[number]} streetAddressScore Street address score
 * @param {[number]} zipcode4Address Zipcode4 address
 * @param {[number]} cityAddressScore City address score
 * @param {[number]} municipalityAddressScore Municipality address score
 * @param {[number]} provinceAddressScore Province address score
 * @param {[number]} countryAddressScore Country address score
 * @returns {Object} Knex object
 */
function locationWithinScoreColumn( // eslint-disable-line max-params
  distanceColumnName = 'distance',
  locationTypeColumnName = 'location_type',
  notWithinLocationScore = 0,
  houseAddressScore = 10,
  zipcode6AddressScore = 8,
  streetAddressScore = 6,
  zipcode4Address = 4,
  cityAddressScore = 3,
  municipalityAddressScore = 2,
  provinceAddressScore = 1,
  countryAddressScore = 0) {
  return castAsFloat(knex
    .raw(`
      case
        when ?? = 0 then
          case ??
          when 'HouseAddress' then ?
          when 'Zipcode6Address' then ?
          when 'StreetAddress' then ?
          when 'Zipcode4Address' then ?
          when 'CityAddress' then ?
          when 'MunicipalityAddress' then ?
          when 'ProvinceAddress' then ?
          when 'CountryAddress' then ?
          when 'NetherlandsAddress' then ?
          else ?
          end
        else ?
      end
      `, [
        distanceColumnName,
        locationTypeColumnName,
        houseAddressScore,
        zipcode6AddressScore,
        streetAddressScore,
        zipcode4Address,
        cityAddressScore,
        municipalityAddressScore,
        provinceAddressScore,
        countryAddressScore,
        countryAddressScore,
        notWithinLocationScore,
        notWithinLocationScore,
      ]
    ));
}

/**
 * The first card of a service receives a score 0.
 * Every next card of a service gets a malus score of scoreFactor * row_number.
 * @function sameServiceDiversityScoreColumn
 * @param {[number]} scoreFactor Score factor
 * @param {[number]} scoreColumns Sore columns
 * @returns {Object} Knex object
 */
function sameServiceDiversityScoreColumn(scoreFactor = 0.5, scoreColumns = ['new_score',
  'start_score', 'continuous_score', 'distance_score', 'location_within_score']) {
  return knex.raw(`${scoreFactor} * CAST(1 - row_number() OVER (
      PARTITION BY "service" ORDER BY ${scoreColumns.join('+')} DESC) AS REAL)`, []
  );
}

/**
 * Split the ZipcodeAddress into Zipcode4Address and Zipcode6Address for scoring purposes.
 * @function locationTypeColumnZipcodeDetail
 * @returns {Object} Knex object
 */
function locationTypeColumnZipcodeDetail() {
  return knex
    .raw(`
      case
        when location.type = 'ZipcodeAddress' then
          case
            when location.zipcode_letters IS NULL then 'Zipcode4Address'
            else 'Zipcode6Address'
          end
        else
          location.type
      end
    `, []);
}

/**
 * Get filtered cards
 * @function filteredCards
 * @param {Object} geoJson Address
 * @param {string} userId User Id
 * @param {[string]} tableName Table name
 * @param {[string]} distanceColumnName Distance column name
 * @param {[string]} locationTypeColumnName Location type column name
 * @returns {function} cards function
 */
export function filteredCards(geoJson, // eslint-disable-line max-params
                       userId,
                       tableName = 'card',
                       distanceColumnName = 'distance',
                       locationTypeColumnName = 'location_type') {
  return function FilterCardsQuery() {
    this
      .select([
        'card_within.card_location_nearest_distance_position',
        `card_within.${distanceColumnName}`,
        `card_within.${locationTypeColumnName}`,
        'card.*'])
      .from(function SelectFromNearest() { // TODO: refactor this as a separate function
        this
          .select([
            '*',
            knex.raw('row_number() OVER (PARTITION BY "id" ORDER BY ?? ASC)', [distanceColumnName])
              .as('card_location_nearest_distance_position'),
          ])
          .from(function SelectFrom() {
            this
              .select([
                'card.id',
                knex.st.distanceBetweenColumnAndGeoJson('location.geometry', geoJson).as(distanceColumnName),
                locationTypeColumnZipcodeDetail().as(locationTypeColumnName),
              ])
              .from('card')
              .join('card_location', 'card_location.card', 'card.id')
              .join('location', 'location.id', 'card_location.location')
              .where(knex.st.dwithin(
                'location.geometry',
                geoJson,
                function MaxDefaultDistance() {
                  this.max('default_max_distance').from('service');
                }
              ))
              .where(knex.raw('coalesce("expires_at",?)', ['infinity']), '>', 'now')
              .where('published_at', '<', 'now')
              .as('card_within_windowed');
          })
          .as('card_within');
      })
      .where('card_location_nearest_distance_position', 1) // Only use data from the cards nearest location
      .join('card', 'card.id', 'card_within.id')
      .as(tableName);
    if (userId) {
      this
        .join('user_service_max_distance', function JoinOnMaxUserDistance() {
          this
            .on('user_service_max_distance.service', 'card.service')
            .andOn(`card_within.${distanceColumnName}`, '<=', 'user_service_max_distance.max_distance');
        })
        .where('user_service_max_distance.user', userId)
        .where('user_service_max_distance.is_enabled', true);
    } else {
      this
        .join('service', function JoinOnService() {
          this
            .on('service.id', 'card.service')
            .andOn(`card_within.${distanceColumnName}`, '<=', 'service.default_max_distance');
        })
        .where('service.is_enabled', true);
    }
  };
}

/**
 * Get age column
 * @function ageColumn
 * @returns {Object} Age column
 */
export function ageColumn() {
  return knex.raw('age("published_at")', []);
}

/**
 * Get cards with metadata columns
 * @function cardsWithMetadataColumns
 * @param {Object} geoJson Address
 * @param {string} userId User Id
 * @param {[string]} distanceColumnName Distance column name
 * @param {[string]} newScoreColumnName New score column name
 * @param {[string]} startScoreColumnName Start score column name
 * @param {[string]} continuousScoreColumnName Continuous score column name
 * @param {[string]} distanceScoreColumnName Distance score column name
 * @param {[string]} locationWithinScoreColumnName Location within score column name
 * @param {[string]} sameServiceDiversityScoreColumnName Same service diversity score column name
 * @returns {Array} Cards
 */
export function cardsWithMetadataColumns(geoJson, // eslint-disable-line max-params
                                  userId,
                                  distanceColumnName = 'distance',
                                  newScoreColumnName = 'new_score',
                                  startScoreColumnName = 'start_score',
                                  continuousScoreColumnName = 'continuous_score',
                                  distanceScoreColumnName = 'distance_score',
                                  locationWithinScoreColumnName = 'location_within_score',
                                  sameServiceDiversityScoreColumnName =
                                    'same_service_diversity_score') {
  const locationTypeColumnName = 'location_type';

  return knex
    .select('*')
    .from(
      knex
        .select('*')
        .from(filteredCards(geoJson, userId, 'filtered_card', distanceColumnName,
          locationTypeColumnName))
        .column([
          newScoreColumn('1 day', 7, 0).as(newScoreColumnName),
          startingSoonScoreColumn(0, 7, 0).as(startScoreColumnName),
          continuousScoreColumn().as(continuousScoreColumnName),
          distanceScoreColumn(distanceColumnName, 0, 1000, 1).as(distanceScoreColumnName),
          locationWithinScoreColumn(distanceColumnName, locationTypeColumnName)
            .as(locationWithinScoreColumnName),
        ]).as('card_with_scores'))
    .column([
      sameServiceDiversityScoreColumn(0.5, SAME_SERVICE_DIVERSITY_COLUMNS)
        .as(sameServiceDiversityScoreColumnName),
    ]);
}

/**
 * Get relevance score column
 * @function relevanceScoreColumn
 * @param {[Array]} scoreColumns Score columns
 * @returns {Object} Relevance score column
 */
export function relevanceScoreColumn(scoreColumns = STANDARD_SCORE_COLUMNS) {
  return knex.raw(scoreColumns.join('+'), []);
}

/**
 * Get scores object column
 * @function scoresObjectColumn
 * @param {[Array]} columnNames Column names
 * @returns {Object} Scores object column
 */
export function scoresObjectColumn(columnNames = []) {
  const fieldNames = columnNames
    .map(camelCase)
    .map(value => `'${value}'`)
    .join(',');
  return knex.raw(
    `json_object(array[${fieldNames}], array[${columnNames.join(',')}]::text[])`, []);
}
