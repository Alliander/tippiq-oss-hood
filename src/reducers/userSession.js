
import { has } from 'lodash';
import {
  LOGIN,
  LOGOUT,
  FETCH_CITY_GEOMETRY,
  FETCH_PLACE_LOCATION,
} from '../constants/ActionTypes';

const initialState = {
  pending: false,
  error: null,
  token: null,
  placeId: null,
  location: null,
  geometry: null,
  loggedIn: false,
  placeAccessToken: null,
  placePolicyUrl: null,
};

const actionsMap = {
  [`${LOGIN}_PENDING`]: () => ({ pending: true, error: null, loggedIn: false }),
  [`${LOGIN}_SUCCESS`]: (state, action) => ({
    ...action.result,
    ...{
      pending: false,
      error: null,
      loggedIn: has(action.result, 'token'),
    },
  }),
  [`${LOGIN}_ERROR`]: (state, action) => ({ pending: false, error: action.error, loggedIn: false }),
  [`${FETCH_CITY_GEOMETRY}_SUCCESS`]: (state, action) =>
    ({ geometry: action.result.location.geometry }),
  [`${FETCH_PLACE_LOCATION}_SUCCESS`]: (state, action) => ({
    ...state,
    location: action.result.location,
  }),
  [LOGOUT]: () => ({ ...initialState }),
};

/**
 * UserSession reducer
 * @function
 * @param {Object} state initialstate.
 * @param {Object} action result.
 * @returns {Promise} Action promise.
 */
export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) {
    return state;
  }

  return { ...state, ...reduceFn(state, action) };
}
