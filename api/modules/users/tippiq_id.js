import request from 'superagent';
import BPromise from 'bluebird';
import { WeeklyNotificationError } from '../../common/errors';
import { ACTIONS, getSignedPlacesJwt } from '../auth';
import config from '../../config';

const defaultSendEmailUrl = `${config.tippiqIdBaseUrl}/api/email/send-email`;

/**
 * Send email via Tippiq Places which in turn sends the email to Tippiq ID
 * @function sendEmail
 * @param {object} data The email data
 * @param {object} userPlace user place model
 * @returns {object} Result body
 * TODO split into places and id method
 */
export function sendEmail(data, userPlace) {
  let emailRequestJson = data;
  let sendEmailUrl = defaultSendEmailUrl;
  if (userPlace) {
    sendEmailUrl = `${config.tippiqPlacesBaseUrl}/api/places/${userPlace.get('placeId')}/users/${userPlace.get('userId')}/messages/rendered-email`;
    emailRequestJson = {
      from: config.fromEmailAddress,
      userId: userPlace.get('userId'),
      serviceProviderId: config.oAuth2ClientId,
      html: data.html,
      text: data.text,
      subject: data.subject,
    };
  }
  return getSignedPlacesJwt({ action: ACTIONS.SEND_MESSAGE })
    .then(serviceToken =>
      request
        .post(sendEmailUrl)
        .set('Authorization', `Bearer ${serviceToken}`)
        .send(emailRequestJson)
        .then(result => result.body)
        .catch(err => BPromise.reject(new WeeklyNotificationError(err)))
    ).catch(err => BPromise.reject(new WeeklyNotificationError(err)));
}

export default {
  sendEmail,
};
