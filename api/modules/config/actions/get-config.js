/**
 * Response handler for config/get-config.
 * @module modules/config/actions/get-config
 */

import config from './../../../config';

/**
 * Response handler for getting the config.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  res.json({
    frontendBaseUrl: config.frontendBaseUrl,
    tippiqIdBaseUrl: config.tippiqIdBaseUrl,
    tippiqAddressesBaseUrl: config.tippiqAddressesBaseUrl,
    locationAttributeType: config.locationAttributeType,
    locationPolicy: config.locationPolicy,
    newsletterPolicy: config.newsletterPolicy,
    serviceId: config.oAuth2ClientId,
    locationPolicySlug: config.locationPolicySlug,
    newsletterPolicySlug: config.newsletterPolicySlug,
  });
}
