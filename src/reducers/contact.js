/**
 * Contact reducer.
 * @module reducers/contact
 */

import {
  CONTACT,
} from '../constants/ActionTypes';

const initialState = {
  pending: false,
  error: false,
  success: false,
};

const actionsMap = {
  [`${CONTACT}_PENDING`]: () => ({ pending: true, error: false, success: false }),
  [`${CONTACT}_SUCCESS`]: () => ({ pending: false, error: false, success: true }),
  [`${CONTACT}_ERROR`]: () => ({ pending: false, error: true, success: false }),
};

/**
 * Contact reducer
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
