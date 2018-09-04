/**
 * NotificationTemplateModel
 * @module modules/notification-templates/models/notification-template-model
 */

import debugLogger from 'debug-logger';
import _ from 'lodash';
import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-hood:notification-templates:model');

const defaultSerializationFields = [
  'id',
  'name',
  'description',
  'startDate',
  'endDate',
  'subject',
  'htmlTop',
  'htmlBottom',
  'textTop',
  'textBottom',
];

const instanceProps = {
  tableName: 'notification_template',
  serialize(opts) {
    const options = opts || {};
    options.permissions = options.permissions || [];

    switch (options.context) {
      case 'template':
        return _
          .chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(defaultSerializationFields)
          .value();

      default:
        debug('unknown serialization context \'%s\'', options.context);
        return {};
    }
  },
  updateWith(update) {
    this.set({
      name: update.name,
      description: update.description,
      startDate: update.startDate,
      endDate: update.endDate,
      subject: update.subject,
      htmlTop: update.htmlTop,
      htmlBottom: update.htmlBottom,
      textTop: update.textTop,
      textBottom: update.textBottom,
    });
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
