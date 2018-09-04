/**
 * Response handler for send single weekly notification.
 * @module weekly-notifications/actions/send-single-weekly-notification
 */
import BPromise from 'bluebird';
import { get, groupBy, map, truncate } from 'lodash';

import { WeeklyNotificationError } from '../../../common/errors';
import notificationTemplate from '../../notification-templates/notification-template';
import { CardRepository } from '../../cards/repositories';
import { sendEmail } from '../../users/tippiq_id';
import { renderEmailTemplate } from '../../email/render-email-template';
import { getLocation } from '../../places/actions/get-location';
import { Address } from '../../../../src/helpers';
import { UserPlaceRepository } from '../../places/repositories';
import { getHighlightAreaHtmlString } from '../../weekly-notifications/feed-parser';
import { rssHighlightWeeklyUrl } from '../../../config';
import { knexTimestamp } from '../../newsletter/send-weekly-newsletter';


export const constants = Object.freeze({
  CARD_SORTING: 'theme',
  NUMBER_OF_CARDS: 100,
  TEMPLATE_NAME: 'weekly-notifications',
});

/**
 * Find cards for a user place combination.
 * @function findCardsForPlace
 * @param {Object} geojson Geo data.
 * @param {Object} userPlace User model.
 * @returns {object} Result of request.
 */
export function findCardsForPlace(geojson, userPlace) {
  return CardRepository
    .findAllNear(geojson, constants.CARD_SORTING, constants.NUMBER_OF_CARDS, userPlace)
    .then((cards) => cards.serialize({ context: 'email:weekly-notification' }));
}

/**
 * Sort cards.
 * @function sortCards
 * @param {Object} cards cards.
 * @returns {object} Sorted cards
 */
export function sortCards(cards) {
  if (cards.length < 1) {
    const message = 'Insufficient amount of cards: the weekly notification needs at least one card.';
    throw new WeeklyNotificationError(message);
  }

  return {
    cards: groupBy(map(cards, (card) => {
      const cardWithCategory = card;
      cardWithCategory.cat = card.service.category;
      return cardWithCategory;
    }), 'cat'),
  };
}

const getAddress = location =>
  (Address.fromJson(location) ? Address.fromJson(location).toShortString() : 'Onbekend adres');

const getSubject = (address, sortedCards) => {
  const firstTheme = Object.keys(sortedCards.cards)[0];
  const firstCard = get(sortedCards.cards, firstTheme)[0];
  const firstCardTitle = truncate(firstCard.title, { length: 35, separator: '..' });
  return { subject: `Buurtbericht | ${address} | ${firstCardTitle}` };
};
/**
 * Send an email for a user place.
 * @function  sendEmailForUser
 * @param {object} userPlaceModel UserPlace model.
 * @param {string} highlightAreaContent HTML markup string with content for the high light area
 * @param {string} [timestamp] To update the userPlaceModel with after successfully sending an email
 * @returns {object} userPlaceModel with an updated timestamp.
 */
export function sendEmailForUser(userPlaceModel, highlightAreaContent, timestamp = knexTimestamp) {
  return getLocation(userPlaceModel)
    .then(location => {
      const address = getAddress(location);
      const title = `Buurtbericht ${address}`;
      return findCardsForPlace(location.geometry, userPlaceModel)
        .then(cardsJson => sortCards(cardsJson))
        .then(sortedCards =>
          BPromise
            .resolve(
              notificationTemplate
                .createEmailData(sortedCards, userPlaceModel, highlightAreaContent)
            )
            .then(emailData =>
              notificationTemplate.renderActive({ ...emailData, title }, constants.TEMPLATE_NAME,
                userPlaceModel.get('userId'), userPlaceModel.get('placeId')))
            .then(template => renderEmailTemplate(template, constants.TEMPLATE_NAME))
            .then(templateData =>
              sendEmail({ ...templateData, ...getSubject(address, sortedCards) }, userPlaceModel))
            .then(() =>
              BPromise
                .try(() => (typeof timestamp === 'function' ? timestamp() : timestamp))
                .then(t => userPlaceModel.save('email_last_sent_at', t))
            )
        );
    });
}


/**
 * Send a single newsletter
 * @function sendSingleNewsletter
 * @param {string} userId The Tippiq user id
 * @param {string} placeId The place id
 * @param {boolean} sendFirstTime Optional bool for sending the newsletter for the first time
 * @returns {Promise} Promise that resolves or rejects
 */
export function sendSingleNewsletter(userId, placeId, sendFirstTime = true) {
  const defaultDate = new Date();
  defaultDate.setTime(0);
  let userPlaceModel;
  const whereClause = Object.assign({
    user_id: userId,
    place_id: placeId,
  }, sendFirstTime && { email_last_sent_at: defaultDate });
  return UserPlaceRepository
    .findOne(whereClause)
    .then(userPlace => {
      userPlaceModel = userPlace;
      return getHighlightAreaHtmlString(rssHighlightWeeklyUrl)
        .then(highlightContentString =>
          sendEmailForUser(userPlaceModel, highlightContentString));
    });
}
