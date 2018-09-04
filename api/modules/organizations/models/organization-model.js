/**
 * OrganizationModel.
 * @module modules/organizations/models/organization-model
 */

import debugLogger from 'debug-logger';
import { chain } from 'lodash';
import BaseModel from '../../../common/base-model';
import { ImageCollection } from '../../images/models';

const debug = debugLogger('tippiq-hood:organizations:model');

const instanceProps = {
  tableName: 'organization',
  serialize(optionsArg = {}) { // eslint-disable-line complexity
    const options = Object.assign({}, { permissions: [] }, optionsArg);
    let fields;

    switch (options.context) {
      case 'card':
      case 'card-stream':
      case 'card-cta-redirect':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['name', 'bio', 'images'])
          .defaults({ images: {} })
          .value();

      case 'organization':
        fields = ['name', 'bio', 'images'];

        if (options.permissions.indexOf('get_partner_info') >= 0) {
          fields.unshift('isPartner');
          fields.unshift('partnerLevel');
        }

        if (options.permissions.indexOf('get_organization_id') >= 0) {
          fields.unshift('id');
        }

        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(fields)
          .defaults({ images: {} })
          .value();

      case 'email:weekly-notification':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['name', 'bio', 'images'])
          .defaults({ images: {} })
          .value();

      case 'organization:partner':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['name', 'bio', 'images', 'website'])
          .value();

      case 'service':
        return chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['id', 'name', 'bio', 'images'])
          .defaults({ images: {} })
          .value();

      default:
        debug('unknown serialization context \'%s\'', options.context);
        return {};
    }
  },
  images() {
    return this.belongsToMany(ImageCollection, 'object_image', 'object_id', 'image').withPivot(['key']);
  },
  updateWith(organizationData) {
    return this.keys().forEach(key => {
      if (key !== 'id' && typeof organizationData[key] !== 'undefined') {
        this.set(key, organizationData[key]);
      }
    });
  },
  setImages(imageMap) {
    return this.images().detach()
      .then(() => this.images().attach(imageMap))
      .then(() => this);
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
