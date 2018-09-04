/**
 * Actions.
 * @module actions
 */
import {
  LOGIN,
  LOGOUT,
  APP_CONFIG,
  FETCH_CARDS,
  FETCH_CARD,
  FETCH_CITY_GEOMETRY,
  FETCH_SERVICES,
  SET_SORT,
  FETCH_PLACE_LOCATION,
  UPDATE_PLACE_SETTINGS,
  SET_WEEKLY_ENABLED,
  GET_WEEKLY_ENABLED_STATUS,
  INIT_SERVICE_FILTER,
  TOGGLE_SERVICE_FILTER,
  TOGGLE_THEME_FILTER,
  UPDATE_ADDRESS_SUGGESTION_VALUE,
  CLEAR_ADDRESS_SUGGESTIONS,
  FETCH_ADDRESS_SUGGESTIONS,
  CONTACT,
  SEND_FIRST_NEWSLETTER,
} from '../constants/ActionTypes';

/**
 * Login function.
 * @function login
 * @param {string} token Auth token.
 * @param {string} accessToken Access token.
 * @returns {Object} Login action.
 */
export function login(token, accessToken) {
  return {
    types: [LOGIN],
    promise: api => api.post('/users/login', { data: { token, accessToken } }),
  };
}

/**
 * Logout function.
 * @function logout
 * @returns {Object} logout action.
 */
export function logout() {
  return { type: LOGOUT };
}

/**
 * Get place location function.
 * @function getPlaceLocation
 * @param {string} placeId Place id.
 * @param {string} code Auth code.
 * @returns {Object} Location.
 */
export function getPlaceLocation(placeId, code = '') {
  return {
    types: [FETCH_PLACE_LOCATION],
    promise: api => api.get(`/places/${placeId}/location?code=${code}`),
  };
}

/**
 * Update place settings function.
 * @function updatePlaceSettings
 * @param {string} placeId Place id.
 * @param {string} code Auth code.
 * @returns {Object} Location.
 */
export function updatePlaceSettings(placeId, code = '') {
  return {
    types: [UPDATE_PLACE_SETTINGS],
    promise: api => api.get(`/places/${placeId}/settings?code=${code}`),
  };
}


/**
 * Send first weekly
 * @function sendFirstWeeklyNotification
 * @param {string} placeId Place id
 * @returns {Object} .
 */
export function sendFirstWeeklyNotification(placeId) {
  return {
    types: [SEND_FIRST_NEWSLETTER],
    promise: api => api.get(`/send-weekly-newsletter/placeId/${placeId}/send-first-newsletter`),
  };
}

/**
 * Toggle weekly notification
 * @function toggleWeeklyNotification
 * @param {string} placeId PlaceId
 * @returns {Object} .
 */
export function getWeeklyEnabledStatus(placeId) {
  return {
    types: [GET_WEEKLY_ENABLED_STATUS],
    promise: api => api.get(`/places/${placeId}/email-notification-status`),
  };
}

/**
 * Set weekly notification flag
 * @function setWeeklyEnabled
 * @param {string} placeId Place id.
 * @param {boolean} enabled Enabled flag.
 * @returns {Object} Location.
 */
export function setWeeklyEnabled(placeId, enabled) {
  return {
    types: [SET_WEEKLY_ENABLED],
    promise: api => api.post(`/places/${placeId}/email-notification`, { data: { enabled } }),
  };
}

/**
 * Get app config function.
 * @function getAppConfig
 * @returns {Object} Get app config action.
 */
export const getAppConfig = () => ({
  types: [APP_CONFIG],
  promise: api => api.get('/config'),
});

export const getServices = () => ({
  types: [FETCH_SERVICES],
  promise: api => api.get('/services'),
});

export const initServiceFilter = (themes, services) => ({
  type: INIT_SERVICE_FILTER,
  services,
  themes,
});

export const toggleServiceFilter = service => ({
  type: TOGGLE_SERVICE_FILTER,
  service,
});

export const setSort = method => ({
  type: SET_SORT,
  method,
});

export const toggleThemeFilter = theme => ({
  type: TOGGLE_THEME_FILTER,
  theme,
});

export const getCards = (sort, geometry, ids = []) => ({
  types: [FETCH_CARDS],
  promise: api => api.post(
    `/cards/search${ids.length > 0 ?
      `?service=${ids.join('&service=')}&sort=${sort}` :
      `?sort=${sort}`}`,
    { data: { geometry } },
  ),
});

export const getCard = (id) => ({
  types: [FETCH_CARD],
  promise: api => api.get(`/cards/${id}`),
});

export const getCityGeometry = city => ({
  types: [FETCH_CITY_GEOMETRY],
  promise: api => api.get(`/addresses/lookup?name=${city}&type=city`),
});

export const updateAddressSuggestionValue = (query, selected) => ({
  type: UPDATE_ADDRESS_SUGGESTION_VALUE,
  query,
  selected,
});

export const getAddressSuggestions = query => ({
  types: [FETCH_ADDRESS_SUGGESTIONS],
  query,
  promise: api => api.get('/addresses/search', { params: { query } }),
});

export const clearAddressSuggestions = () => ({ type: CLEAR_ADDRESS_SUGGESTIONS });

/**
 * Contact form function.
 * @function sendContactForm
 * @param {object} body Form fields.
 * @returns {Object} Send action.
 */
export function sendContactForm(body) {
  return {
    types: [CONTACT],
    promise: api => api.post('/contact', { data: body }),
  };
}
