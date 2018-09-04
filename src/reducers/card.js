/**
 * Card reducer.
 * @module reducers/cards
 */

import {
  FETCH_CARD,
  SET_SORT,
} from '../constants/ActionTypes';

const initialState = {
  pending: false,
  error: false,
  item: [],
  success: false,
};

const actionsMap = {
  [`${FETCH_CARD}_PENDING`]: () => ({ pending: true, error: false }),
  [`${FETCH_CARD}_SUCCESS`]: (state, action) => ({
    item: [action.result],
    pending: false,
    error: false,
    success: true,
  }),
  [`${FETCH_CARD}_ERROR`]: () => ({ pending: false, error: true }),
  [SET_SORT]: (state, action) => ({ sort: action.method }),
};

/**
 * Card reducer
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
