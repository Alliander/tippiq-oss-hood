/**
 * placeSettings reducer.
 * @module reducers/placeSettings
 */

import { UPDATE_PLACE_SETTINGS } from '../constants/ActionTypes';

const initialState = {
  idle: true,
  pending: false,
  success: false,
  error: null,
};

const actionsMap = {
  [`${UPDATE_PLACE_SETTINGS}_PENDING`]: () => ({
    idle: false,
    pending: true,
  }),
  [`${UPDATE_PLACE_SETTINGS}_SUCCESS`]: (state, action) => ({
    pending: false,
    success: action.result.success,
    error: null,
  }),
  [`${UPDATE_PLACE_SETTINGS}_ERROR`]: (state, action) => ({
    pending: false,
    success: false,
    error: action.error,
  }),
};

/**
 * placeSettings reducer
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
