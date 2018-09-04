/**
 * NewsLetter reducer.
 * @module reducers/newsLetter
 */

import {
  GET_WEEKLY_ENABLED_STATUS,
  SET_WEEKLY_ENABLED,
} from '../constants/ActionTypes';

const initialState = {
  active: false,
};

const actionsMap = {
  [`${SET_WEEKLY_ENABLED}_PENDING`]: () => ({ pending: true, error: null }),
  [`${SET_WEEKLY_ENABLED}_SUCCESS`]: (state, action) => ({
    active: action.result.email_notifications_enabled,
    ...{ pending: false, error: null } }),
  [`${SET_WEEKLY_ENABLED}_ERROR`]: (state, action) => ({ pending: false, error: action.error }),

  [`${GET_WEEKLY_ENABLED_STATUS}_PENDING`]: () => ({ pending: true, error: null }),
  [`${GET_WEEKLY_ENABLED_STATUS}_SUCCESS`]: (state, action) => ({
    active: action.result.email_notifications_enabled,
    ...{ pending: false, error: null } }),
  [`${GET_WEEKLY_ENABLED_STATUS}_ERROR`]: (state, action) => ({ pending: false, error: action.error }),
};

/**
 * NewsLetter reducer
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
