/**
 * Cards reducer.
 * @module reducers/cards
 */

import {
  FETCH_CARDS,
  SET_SORT,
} from '../constants/ActionTypes';

const initialState = {
  idle: true,
  pending: false,
  error: false,
  items: [],
  sort: 'diversify',
};

const actionsMap = {
  [`${FETCH_CARDS}_PENDING`]: () => ({ pending: true, error: false, idle: false }),
  [`${FETCH_CARDS}_SUCCESS`]: (state, action) => ({
    items: action.result,
    pending: false,
    error: false,
  }),
  [`${FETCH_CARDS}_ERROR`]: () => ({ pending: false, error: true }),
  [SET_SORT]: (state, action) => ({ sort: action.method }),
};

/**
 * Cards reducer
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
