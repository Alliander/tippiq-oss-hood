/**
 * ServiceModel.
 * @module modules/services/models/service-model
 */

import debugLogger from 'debug-logger';
import { chain } from 'lodash';
import BaseModel from '../../../common/base-model';
import { ImageCollection } from '../../images/models';
import { Organization } from '../../organizations/models';

const debug = debugLogger('tippiq-hood:services:model');

const instanceProps = {
  tableName: 'service',
  serialize(optionsArg = {}) { // eslint-disable-line complexity
    const options = Object.assign({}, { permissions: [] }, optionsArg);
    let fields;

    switch (options.context) {
      case 'card':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['id', 'name', 'category', 'url', 'shortDescription', 'description', 'images'])
          .defaults({ images: {} })
          .value();

      case 'card-stream':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['name', 'category', 'url', 'shortDescription', 'description', 'images'])
          .defaults({ images: {} })
          .value();

      case 'card-cta-redirect':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['name', 'category', 'url', 'shortDescription', 'description', 'organization'])
          .value();

      case 'service':
        fields = ['id', 'name', 'category', 'organization', 'url', 'shortDescription',
          'description', 'images', 'defaultMaxDistance', 'isEnabled'];

        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(fields)
          .value();

      case 'email:weekly-notification':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick([
            'id',
            'name',
            'category',
            'organization',
            'url',
            'shortDescription',
            'description',
            'images',
            'defaultMaxDistance',
            'isEnabled',
          ])
          .value();

      case 'user:service-preferences':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick([
            'id',
            'name',
            'category',
            'url',
            'shortDescription',
            'description',
            'defaultMaxDistance',
            'isEnabled',
          ])
          .value();

      default:
        debug('serialization context \'%s\' unknown', options.context);
        return {};
    }
  },
  organization() {
    return this.belongsTo(Organization, 'organization_id');
  },
  images() {
    return this
      .belongsToMany(ImageCollection, 'object_image', 'object_id', 'image')
      .withPivot(['key']);
  },
  setImages(imageMap) {
    return this.images().detach()
      .then(() => this.images().attach(imageMap))
      .then(() => this);

    /* var that = this;

    return that.images().detach()
      .then(function () {
        return that.images().attach(imageMap);
      })
      .then(function () {
        return that;
      });
      */
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
