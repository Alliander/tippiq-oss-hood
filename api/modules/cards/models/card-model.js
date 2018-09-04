/**
 * CardModel.
 * @module modules/cards/models/card-model
 */

import debugLogger from 'debug-logger';
import { chain } from 'lodash';
import BaseModel from '../../../common/base-model';
import { Tag } from '../../tags/models';
import { ImageCollection } from '../../images/models';
import { Service } from '../../services/models';
import { Organization } from '../../organizations/models';
import { Location } from '../../locations/models';
import { bookshelfOptions } from '../../../common/utils';

const debug = debugLogger('tippiq-hood:cards:model');

const defaultSerializationFields = [
  'id',
  'externalId',
  'parentId',
  'title',
  'description',
  'startDate',
  'endDate',
  'publishedAt',
  'expiresAt',
  'documentType',
  'document',
  'images',
  'tags',
  'author',
  'publisher',
  'service',
  'distance',
  'relevanceScore',
  'scores',
  'age',
];

const instanceProps = {
  tableName: 'card',
  serialize(optionsArg = {}) { // eslint-disable-line complexity
    const options = Object.assign({}, { permissions: [] }, optionsArg);
    let fields;
    switch (options.context) {
      case 'card-cta-redirect':
      case 'service':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(defaultSerializationFields.concat('locations'))
          .defaults({ images: {} })
          .value();

      case 'card':
        fields = options.permissions.indexOf('get_service_id') >= 0 &&
        options.permissions.indexOf('get_organization_id') >= 0 ?
          chain(defaultSerializationFields.concat('locations', 'publisherId', 'authorId'))
            .without('author', 'publisher')
            .value() :
          defaultSerializationFields.concat('locations');

        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .tap(obj => {
            if (options.permissions.indexOf('get_service_id') >= 0 &&
              options.permissions.indexOf('get_organization_id')) {
              obj.service = obj.service.id; // eslint-disable-line no-param-reassign
            }
          })
          .pick(fields)
          .defaults({ images: {} })
          .value();

      case 'card-stream':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(defaultSerializationFields.concat('distance'))
          .defaults({ images: {} })
          .value();

      case 'email:weekly-notification':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(defaultSerializationFields.concat('distance'))
          .defaults({ images: {} })
          .value();

      default:
        debug('unknown serialization context \'%s\'', options.context);
        return {};
    }
  },
  images() {
    return this
      .belongsToMany(ImageCollection, 'object_image', 'object_id', 'image')
      .withPivot(['key']);
  },
  locations() {
    return this.belongsToMany(Location, 'card_location', 'card', 'location');
  },
  tags() {
    return this.belongsToMany(Tag, 'card_tag', 'card', 'tag');
  },
  author() {
    return this.belongsTo(Organization, 'author_id');
  },
  publisher() {
    return this.belongsTo(Organization, 'publisher_id');
  },
  service() {
    return this.belongsTo(Service, 'service');
  },
  updateWith(update) {
    this.set({
      externalId: update.externalId,
      parentId: update.parentId,
      service: update.service,
      title: update.title,
      description: update.description,
      startDate: update.startDate,
      endDate: update.endDate,
      publishedAt: update.publishedAt,
      expiresAt: update.expiresAt,
      authorId: update.authorId,
      publisherId: update.publisherId,
      owner: update.owner,
      documentType: update.documentType,
      document: update.document,
    });
  },
  setTags(tagIds, transaction) {
    const options = bookshelfOptions(transaction);

    return this.tags().detach(null, options)
      .then(() => this.tags().attach(tagIds, options))
      .then(() => this);
  },
  setImages(imageMap, transaction) {
    const options = bookshelfOptions(transaction);

    return this.images().detach(null, options)
      .then(() => this.images().attach(imageMap, options))
      .then(() => this);
  },
  setLocations(locationIds, transaction) {
    const options = bookshelfOptions(transaction);

    return this.locations().detach(null, options)
      .then(() => this.locations().attach(locationIds, options))
      .then(() => this);
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
