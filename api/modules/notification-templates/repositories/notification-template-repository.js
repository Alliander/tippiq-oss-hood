/**
 * TemplatesRepository.
 * @module modules/notification-templates/repositories/organization-repository
 */

import autobind from 'autobind-decorator';
import { NotificationTemplate } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for notification templates.
 * @class NotificationTemplateRepository
 * @extends BaseRepository
 */
export class NotificationTemplateRepository extends BaseRepository {
  /**
   * Construct a NotificationTemplateRepository for an NotificationTemplate.
   * @constructs NotificationTemplateRepository
   */
  constructor() {
    super(NotificationTemplate);
  }


  /**
   * Find all with where clause
   * @function findAll
   * @param {object} where Where clause
   * @returns {Array} NotificationTemplates array
   */
  findAll(where) {
    const whereClause = where || {};
    return NotificationTemplate
      .where(whereClause)
      .fetchAll();
  }


  /**
   * Find current
   * @function findCurrent
   * @param {string} name Name of the template
   * @return {*|Promise.<NotificationTemplate|null>} A single NotificationTemplate model
   */
  findCurrent(name) {
    return NotificationTemplate
      .where({ name })
      .query(qb => {
        qb
          .whereRaw('\'today\' BETWEEN coalesce(start_date, \'-infinity\') AND coalesce(end_date, \'infinity\')')
          .orderByRaw('end_date ASC NULLS LAST')
          .limit(1);
      })
      .fetch({
        require: true,
      });
  }

  /**
   * Update by Id
   * @function updateTemplateById
   * @param {uuid} id Id of the template to update
   * @param {object} templateJson JSON object with template data
   * @returns {Promise.<NotificationTemplate>} An updated NotificationTemplate record
   */
  updateTemplateById(id, templateJson) {
    const templateRecordJson = this.templateRecordJsonFromTemplateJson(templateJson);
    // TODO: wrap this in a transaction
    return NotificationTemplate
      .where({ id })
      .fetch({
        require: true,
      })
      .then(templateRecord => {
        templateRecord.updateWith(templateRecordJson);
        return templateRecord.save();
      });
  }

  /**
   * Converts the template data to JSON
   * @function templateRecordJsonFromTemplateJson
   * @param {object} inputObj Input object
   * @returns {object} An object to insert into the database
   */
  templateRecordJsonFromTemplateJson(inputObj) {
    return {
      name: inputObj.name,
      description: inputObj.description,
      startDate: inputObj.startDate,
      endDate: inputObj.endDate,
      subject: inputObj.subject,
      htmlTop: inputObj.htmlTop,
      htmlBottom: inputObj.htmlBottom,
      textTop: inputObj.textTop,
      textBottom: inputObj.textBottom,
    };
  }

  /**
   * Exposes template generic functions
   * @function template
   * @returns {object} An object with helper functions
   */
  template() {
    return NotificationTemplate;
  }
}

export default new NotificationTemplateRepository();
