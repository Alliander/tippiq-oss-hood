/**
 * module for backend config.
 * @module config
 */
const _ = require('lodash');

const locationAttributeType = 'tippiq_Tippiq_place_tippiq_location';
const locationPolicySlug = 'tippiq_Tippiq_place_tippiq_location';
const newsletterPolicySlug = 'tippiq_Tippiq_hood_tippiq_newsletter';

const config = _.defaults(
  {
    databaseUrl: process.env.TIPPIQ_HOOD_DATABASE_URL,
    tippiqHoodPrivateKey: process.env.TIPPIQ_HOOD_PRIVATE_KEY,
    tippiqHoodPublicKey: process.env.TIPPIQ_HOOD_PUBLIC_KEY,
    tippiqIdPublicKey: process.env.TIPPIQ_ID_PUBLIC_KEY,
    jwtIssuer: process.env.JWT_ISSUER,
    jwtAudiencePlaces: process.env.JWT_AUDIENCE_PLACES,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    tippiqIdBaseUrl: process.env.TIPPIQ_ID_BASE_URL,
    tippiqAddressesBaseUrl: process.env.TIPPIQ_ADDRESSES_BASE_URL,
    tippiqPlacesBaseUrl: process.env.TIPPIQ_PLACES_BASE_URL,
    oAuth2ClientId: process.env.TIPPIQ_HOOD_CLIENT_ID,
    oAuth2ClientSecret: process.env.TIPPIQ_HOOD_CLIENT_SECRET,
    tippiqIdJwtIssuer: process.env.TIPPIQ_ID_JWT_ISSUER,
    contactFormAddress: process.env.CONTACT_FORM_ADDRESS,
    rssHighlightWeeklyUrl: process.env.RSS_HIGHLIGHT_WEEKLY_URL,
  },
  {
    databaseUrl: 'postgresql://tippiq_hood:tippiq_hood@localhost:5432/tippiq_hood?ssl=false',
    tippiqHoodPrivateKey: `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIJgM/TXgJh8ADEsH+NuDG4W4acIwcHmhpsJiNjsMsvQEoAcGBSuBBAAK
oUQDQgAEvmC2rDsrwYWTRM++en5v8G+vZ29iWwH1ZqzeFFvNJQKzY+vCdGI4RJgI
YxmIqeCRCj1VI7gU8jGXOMNaAnfw0Q==
-----END EC PRIVATE KEY-----`,
    tippiqHoodPublicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEvmC2rDsrwYWTRM++en5v8G+vZ29iWwH1
ZqzeFFvNJQKzY+vCdGI4RJgIYxmIqeCRCj1VI7gU8jGXOMNaAnfw0Q==
-----END PUBLIC KEY-----`,
    tippiqIdPublicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEIwr0ttbt6S6lj3e8nuP3KN/clEw1RICw
k5d2Yy4hgKn7e6kBjeORFNnQDNj5GIGNmK0zb3SzW17JNzf22ooavQ==
-----END PUBLIC KEY-----`,
    tippiqIdJwtIssuer: 'tippiq-id.local',
    jwtIssuer: 'tippiq-hood.local',
    jwtAudiencePlaces: 'tippiq-places.local',
    frontendBaseUrl: 'http://localhost:3007',
    tippiqIdBaseUrl: 'http://localhost:3001',
    tippiqAddressesBaseUrl: 'https://tippiq-test.tippiq.rocks',
    tippiqPlacesBaseUrl: 'http://localhost:3010',
    oAuth2ClientId: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    oAuth2ClientSecret: 'tpq',
    locationPolicySlug,
    newsletterPolicySlug,
    locationAttributeType,
    locationPolicyRequest: [{
      title: 'Uitlezen van lokatie gegevens van mijn huis',
      policies: [
        locationPolicySlug,
        newsletterPolicySlug,
      ],
    }],
    locationPolicy: {
      title: 'Tippiq Buurt mag de locatie van dit Huis lezen om mij relevante buurtinformatie te tonen.',
    },
    newsletterPolicy: {
      title: 'Tippiq Buurt mag mij via dit huis e-mailberichten sturen om mij het Buurtbericht te bezorgen.',
    },
    contactFormAddress: 'team@tippiq.nl',
    fromEmailAddress: 'Tippiq Buurt <noreply@tippiq.nl>',
    rssHighlightWeeklyUrl: 'https://www.tippiq.nl/category/MarComBuurtbericht/feed',
  },
);

module.exports = config;
