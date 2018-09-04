/**
 * AddressSuggestion reducer.
 * @module reducers/addressSuggestion
 */
import {
  FETCH_ADDRESS_SUGGESTIONS,
  CLEAR_ADDRESS_SUGGESTIONS,
  UPDATE_ADDRESS_SUGGESTION_VALUE,
} from '../constants/ActionTypes';

const initialState = {
  pending: false,
  error: false,
  selected: null,
  query: '',
  items: [],
};

const actionsMap = {
  [`${FETCH_ADDRESS_SUGGESTIONS}_PENDING`]: state => ({ ...state, pending: true, error: false }),
  [`${FETCH_ADDRESS_SUGGESTIONS}_SUCCESS`]: (state, action) => ({
    ...state,
    items: action.result,
    pending: false,
    error: false,
  }),
  [UPDATE_ADDRESS_SUGGESTION_VALUE]: (state, action) => ({
    ...state,
    query: action.query,
    selected: action.selected,
  }),
  [`${FETCH_ADDRESS_SUGGESTIONS}_ERROR`]: state => ({ ...state, pending: false, error: true }),
  [`${CLEAR_ADDRESS_SUGGESTIONS}`]: state => ({
    ...state,
    items: [],
  }),
};

/**
 * AddressSuggestion reducer
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
