/**
 * Notification template module.
 * @module notification-template
 */

import nunjucks from 'nunjucks';
import NotificationTemplateRepository from './repositories/notification-template-repository';
import { WeeklyNotificationError } from '../../common/errors';
import { getSignedHoodJwt, ACTIONS } from '../auth';
import config from '../../config';
/**
 * Create email data
 * @function createEmailData
 * @param {object} places Places data
 * @param {object} userPlaceModel UserPlace model
 * @param {string} highlightAreaContent HTML markup string with content for the high light area
 * @return {{frontendBaseURL: (string|*), unsubscribeURL: string, settingsURL: string, userId: *,
 * userName: *, places: *}} Email data
 */
function createEmailData(places, userPlaceModel, highlightAreaContent) {
  return {
    frontendBaseUrl: config.frontendBaseUrl,
    tippiqIdBaseUrl: config.tippiqIdBaseUrl,
    settingsURL: `${config.frontendBaseUrl}/instellingen/voorkeuren`,
    userId: userPlaceModel.get('userId'),
    places,
    highlightAreaContent,
  };
}

/**
 * Get the active template
 * @function getActiveTemplate
 * @param {string} templateName The template name
 * @return {*} Returns the active template notification model
 */
function getActiveTemplate(templateName) {
  return NotificationTemplateRepository.findCurrent(templateName);
}

/**
 * Render email
 * @function render
 * @param {string} template The template name
 * @param {object} emailData The emailData object
 * @param {string} unsubscribeToken unsubscribe validation token
 * @param {string} loginToken user login token
 * @return {{templateName: string, userId: *, verificationRequired: boolean,
 * subject: string, templateData: *}} Rendered email
 */
function render(template, emailData, unsubscribeToken, // eslint-disable-line complexity
                loginToken) {
  const subject = template.get('subject') ||
    'Tippiq Buurtbericht | Wat er rond jouw huis gebeurt deze week';
  let unsubscribeUrl = `${config.frontendBaseUrl}/api/send-weekly-newsletter/unsubscribe/`;
  const redirectUrl = `${config.frontendBaseUrl}/buurtbericht`;
  unsubscribeUrl += `?token=${unsubscribeToken}&redirectUrl=${redirectUrl}`;

  return {
    templateName: 'weekly-notifications',
    userId: emailData.userId,
    verificationRequired: true,
    subject,
    templateData: Object.assign(emailData, {
      htmlTop: nunjucks.renderString(template.get('htmlTop') || '', emailData),
      htmlBottom: nunjucks.renderString(template.get('htmlBottom') || '', emailData),
      textTop: nunjucks.renderString(template.get('textTop') || '', emailData),
      textBottom: nunjucks.renderString(template.get('textBottom') || '', emailData),
      subject,
      unsubscribeUrl,
      loginToken,
    }),
  };
}

/**
 * Render the active template
 * @function renderActive
 * @param {object} emailData The email data
 * @param {string} templateName The template name
 * @param {string} userId the userId
 * @param {string} placeId the user's placeId
 * @returns {object} The rendered email template object
 */
function renderActive(emailData, templateName, userId, placeId) {
  let template;
  let unsubscribeToken;
  return getActiveTemplate(templateName)
    .then(result => {
      template = result;
      return getSignedHoodJwt({
        action: ACTIONS.UNSUBSCRIBE_WEEKLY_NOTIFICATION,
        sub: userId,
        placeId,
      });
    })
    .then(token => {
      unsubscribeToken = token;
      return getSignedHoodJwt({
        action: ACTIONS.LOGIN_SESSION,
        sub: userId,
        placeId,
      });
    })
    .then(loginToken => render(template, emailData, unsubscribeToken, loginToken))
    .catch(NotificationTemplateRepository.template().NotFoundError, err => {
      throw new WeeklyNotificationError('No active NotificationTemplate', err);
    });
}

export default {
  createEmailData,
  getActiveTemplate,
  renderActive,
  render,
};
