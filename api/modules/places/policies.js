import querystring from 'querystring';

import config from '../../config';

/**
 * Construct url to retrieve access token for place
 * @function createPlacePolicyUrl
 * @param {string} placeId PlaceId to get access for
 * @returns {undefined}
 */
export function createPlacePolicyUrl(placeId) {
  const { tippiqPlacesBaseUrl, oAuth2ClientId, frontendBaseUrl, locationPolicyRequest } = config;
  const policiesRequestJsonString = JSON.stringify(locationPolicyRequest);
  const policiesRequestBase64 = new Buffer(policiesRequestJsonString, 'utf8').toString('base64');
  const query = querystring.stringify({
    policiesRequest: policiesRequestBase64,
    response_type: 'code',
    clientId: oAuth2ClientId,
    redirect_uri: `${frontendBaseUrl}/huisregel?place=${placeId}`,
    failure_uri: `${frontendBaseUrl}/huisregel-fout`,
  });
  return `${tippiqPlacesBaseUrl}/huis/${placeId}/huisregels?${query}`;
}
