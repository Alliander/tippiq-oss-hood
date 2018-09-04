/**
 * PlaceLocation reducer.
 * @module reducers/placeLocation
 */

import { FETCH_PLACE_LOCATION } from '../constants/ActionTypes';

const initialState = {
  idle: true,
  pending: false,
  location: null,
  error: null,
};

const actionsMap = {
  [`${FETCH_PLACE_LOCATION}_PENDING`]: () => ({
    idle: false,
    pending: true,
  }),
  [`${FETCH_PLACE_LOCATION}_SUCCESS`]: (state, action) => ({
    ...action.result,
    ...{
      pending: false,
      error: null,
    },
  }),
  [`${FETCH_PLACE_LOCATION}_ERROR`]: (state, action) => ({
    pending: false,
    error: action.error,
  }),
};

/**
 * PlaceLocation reducer
 * @function reducer
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
