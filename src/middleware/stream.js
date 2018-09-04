/**
 * Stream middleware.
 * @module middleware/stream
 */

import { includes } from 'lodash';

import {
  SET_SORT,
  TOGGLE_SERVICE_FILTER,
  TOGGLE_THEME_FILTER,
  INIT_SERVICE_FILTER,
} from '../constants/ActionTypes';

import { getCards } from '../actions';

/**
 * Stream middleware.
 * @function
 * @param {Object} api Api object.
 * @returns {Promise} Action promise.
 */
export default ({ dispatch, getState }) => next => action => {
  const result = next(action);
  let state;

  if (includes([SET_SORT, TOGGLE_SERVICE_FILTER, TOGGLE_THEME_FILTER, INIT_SERVICE_FILTER],
      action.type)) {
    state = getState();
    dispatch(getCards(
      state.cards.sort,
      state.userSession.location ? state.userSession.location.geometry : null,
      state.services.enabledServices
    ));
  }

  return result;
};
