/**
 * Card repository.
 * @module modules/cards/repositories/card-repository
 */

import autobind from 'autobind-decorator';
import BPromise from 'bluebird';

import bookshelf from './../../../common/bookshelf';
import { Card } from '../models';
import BaseRepository from '../../../common/base-repository';
import {
  getCardRelations,
  applyFilters,
  applyCategoryFilter,
  applyServiceFilter,
  applyTagFilter,
} from './card-repository-utils';
import { cardStream } from '../stream-logic/stream-logic';


import { ImageRepository } from '../../images/repositories';
import { TagRepository } from '../../tags/repositories';
import { LocationRepository } from '../../locations/repositories';
import { validateLocation } from '../../locations/location-validation';
import { mapModelsToIds } from '../../../common/utils';

const knex = bookshelf.knex;

@autobind
  /**
   * A Repository for Cards.
   * @class CardRepository
   * @extends BaseRepository
   */
class CardRepository extends BaseRepository {
  /**
   * Construct a CardRepository for Cards.
   * @constructs CardRepository
   */
  constructor() {
    super(Card);
  }

  // TODO Fix overriding base repository call in TPX-739
  /**
   * Find a card (with relations)
   * @function findOneCard
   * @param {Object} where Filter by
   * @returns {Object} Card
   */
  findOneCard(where) {
    return super.findOne(where, { withRelated: getCardRelations() });
  }

  // TODO Fix overriding base repository call in TPX-739
  /**
   * Get card by Id
   * @function findCardById
   * @param {string} id Id of card
   * @returns {Object} Card
   */
  findCardById(id) {
    return this.findOneCard({ id });
  }

  /**
   * Find cards
   * @function findAll
   * @param {Object} searchFilters Search filters
   * @param {number} offset Paging offset
   * @param {number} limit Max results
   * @param {Array} category Categories to filter by
   * @param {Array} service Services to filter by
   * @param {Array} tags Tags to filter by
   * @returns {Array} Cards
   */
  findAll(searchFilters, offset, limit, { category, service, tags }) {
    let dbFilters = [];

    searchFilters.forEach(searchFilter => {
      dbFilters = dbFilters.concat(searchFilter.getQueryProperties());
    });

    return this.Model
      .query(qb => applyFilters(qb, dbFilters))
      .query(qb => applyCategoryFilter(qb, category))
      .query(qb => applyServiceFilter(qb, service))
      .query(qb => applyTagFilter(qb, tags))
      .query(qb => {
        qb
          .offset(offset)
          .limit(limit);
      })
      .fetchAll({ withRelated: getCardRelations() });
  }

  /**
   * Find cards near location
   * @function findAllNear
   * @param {Object} geoJson Search filters
   * @param {String} sorting Sorting type
   * @param {number} limit Max results
   * @param {Object} userPlace UserPlace
   * @param {Array} tags Tags to filter by
   * @param {Array} services Services to filter by
   * @returns {Array} Cards
   */
  findAllNear(geoJson, sorting, limit, userPlace, tags, services) { // eslint-disable-line
                                                                    // max-params, max-len
    return this.Model
      .query(cardStream(geoJson, sorting, limit, userPlace))
      .query(qb => applyServiceFilter(qb, services))
      .query(qb => applyTagFilter(qb, tags))
      .fetchAll({ withRelated: getCardRelations(geoJson) });
  }

  /**
   * Find cards by externalId
   * @function findByExternalId
   * @param {String} externalId ExternalId
   * @returns {Object} Card
   */
  findByExternalId(externalId) {
    return super.findOne({ external_id: externalId });
  }

  /**
   * Create card
   * @function createCard
   * @param {object} cardJson The card in json format
   * @returns {object} Card model
   */
  createCard(cardJson) {
    const cardRecordJson = this.cardRecordJsonFromCardJson(cardJson);
    return bookshelf.transaction(transaction =>
      new Card(cardRecordJson)
        .save(null, { transacting: transaction })
        .then(cardRecord =>
          ImageRepository.updateImages(
            ImageRepository.OBJECT_IMAGE_TYPES.CARD,
            cardRecord,
            cardJson.images,
            transaction
          )
        )
        .then(cardRecord => TagRepository.updateTagsForCard(cardRecord, cardJson.tags, transaction))
        .then(cardRecord =>
          BPromise.resolve(cardJson.locations)
            .map(location => validateLocation(location))
            .map(location => LocationRepository.createLocation(location, transaction))
            .then(mapModelsToIds)
            .then(locationModelIds => cardRecord.setLocations(locationModelIds, transaction))
        )
    );
  }

  /**
   * Build location columns
   * @function buildLocationColumns
   * @param {object} geoJson GeoJson object
   * @return {[string,*]} Location columns
   */
  buildLocationColumns(geoJson) {
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
   * Updates a card
   * @function updateCardWithId
   * @param {string} id Id of the card to update
   * @param {object} cardJson The card in JSON form
   * @return {Promise.<TResult>} An updated card model
   */
  updateCardWithId(id, cardJson) {
    const cardRecordJson = this.cardRecordJsonFromCardJson(cardJson);
    // TODO: wrap this in a transaction
    return Card
      .where({ id })
      .fetch({
        require: true,
        withRelated: ['tags', 'images', 'service', {
          locations: (qb) => {
            qb.column(this.buildLocationColumns());
          },
        }],
      })
      .then(cardRecord => {
        cardRecord.updateWith(cardRecordJson);
        return cardRecord.save();
      })
      .then(cardRecord =>
        ImageRepository.updateImages(
          ImageRepository.OBJECT_IMAGE_TYPES.CARD,
          cardRecord,
          cardJson.images
        )
      )
      .then(cardRecord => TagRepository.updateTagsForCard(cardRecord, cardJson.tags))
      .then(cardRecord =>
        BPromise.resolve(cardJson.locations)
          .map(location => validateLocation(location))
          .map(location => LocationRepository.createLocation(location, true))
          .then(mapModelsToIds)
          .then(locationModelIds => cardRecord.setLocations(locationModelIds))
      );
  }

  /**
   * Delete a card by id
   * @function deleteById
   * @param {string} id Id of the card to delete
   * @returns {Promise} A deleted model
   */
  deleteById(id) {
    return this.findById(id)
      .then(card =>
        BPromise
          .all([
            card.tags().detach(),
            card.images().detach(),
            card.locations().detach(),
          ])
          .then(() => card.destroy())
      );
  }

  /**
   * Create cardRecordJson from card json
   * @function cardRecordJsonFromCardJson
   * @param {object} inputObj The input object
   * @returns {object} Card
   */
  cardRecordJsonFromCardJson(inputObj) {
    return {
      externalId: inputObj.externalId,
      parentId: inputObj.parentId,
      title: inputObj.title,
      description: inputObj.description,
      startDate: inputObj.startDate,
      endDate: inputObj.endDate,
      publishedAt: inputObj.publishedAt,
      expiresAt: inputObj.expiresAt,
      authorId: inputObj.authorId,
      publisherId: inputObj.publisherId,
      owner: inputObj.owner,
      documentType: inputObj.documentType,
      document: inputObj.document,
      service: inputObj.serviceId,
    };
  }
}

export default new CardRepository();

export {
  Card,
};
