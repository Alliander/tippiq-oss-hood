/**
 * Services reducer.
 * @module reducers/services
 */
import { find, sortBy, uniqBy, xor, filter, clone, concat, trim } from 'lodash';
import {
  FETCH_SERVICES,
  INIT_SERVICE_FILTER,
  TOGGLE_SERVICE_FILTER,
  TOGGLE_THEME_FILTER,
} from '../constants/ActionTypes';

const initialState = {
  pending: false,
  error: false,
  services: [],
  filteredServices: [],
  themes: [],
  enabledServices: [],
  enabledThemes: [],
};

/**
 * Toggle service filter
 * @method toggleServiceFilter
 * @param {Object} state Current state
 * @param {string} service Service to toggle
 * @returns {Object} New state
 */
function toggleServiceFilter(state, service) {
  let enabledServices = xor(state.enabledServices, [service]);
  let enabledThemes = clone(state.enabledThemes);
  let filteredServices = clone(state.filteredServices);

  if (enabledServices.length === 0) {
    enabledServices = sortBy(state.services, ['category', 'name']).map(svc => svc.id);
    enabledThemes = [];
    filteredServices = clone(state.services);
  }

  return {
    ...state,
    enabledServices,
    enabledThemes,
    filteredServices,
  };
}

/**
 * Toggle theme filter
 * @method toggleThemeFilter
 * @param {Object} state Current state
 * @param {string} theme Theme to toggle
 * @returns {Object} New state
 */
function toggleThemeFilter(state, theme) {
  const enabledThemes = xor(state.enabledThemes, [theme]);
  let filteredServices;
  let enabledServices;

  // If previous state is 'no themes selected'
  if (state.enabledThemes.length === 0) {
    filteredServices = filter(state.services, service => service.category === theme);
    enabledServices = filteredServices.map(service => service.id);
    // If new state is 'no themes selected'
  } else if (enabledThemes.length === 0) {
    filteredServices = clone(state.services);
    enabledServices = filteredServices.map(service => service.id);
    // Enable a new theme
  } else if (state.enabledThemes.indexOf(theme) === -1) {
    filteredServices = concat(
      state.filteredServices,
      filter(state.services, service => service.category === theme)
    );
    enabledServices = concat(
      state.enabledServices,
      filter(state.services, service => service.category === theme).map(service => service.id)
    );
    // Remove the theme
  } else {
    filteredServices = filter(
      state.filteredServices,
      service => service.category !== theme
    );
    enabledServices = filter(
      state.enabledServices,
      service => find(state.services, { id: service }).category !== theme
    );
  }

  return {
    ...state,
    enabledThemes,
    enabledServices: enabledServices.sort(),
    filteredServices: sortBy(filteredServices, ['category', 'name']),
  };
}

const actionsMap = {
  [`${FETCH_SERVICES}_PENDING`]: state => ({
    ...state,
    pending: true,
    error: false,
  }),
  [`${FETCH_SERVICES}_SUCCESS`]: (state, action) => {
    const services = sortBy(action.result, ['category', 'name']).map(service =>
      ({ ...service, category: trim(service.category) })
    );
    return {
      ...state,
      services,
      filteredServices: services,
      enabledServices: services.map(service => service.id),
      themes: uniqBy(action.result, 'category').map(service => trim(service.category)).sort(),
      pending: false,
      error: false,
    };
  },
  [`${FETCH_SERVICES}_ERROR`]: state => ({
    ...state,
    pending: false,
    error: true,
  }),
  [INIT_SERVICE_FILTER]: (state, action) => {
    const themes = action.themes;
    const services = action.services;
    let myState = {
      ...state,
      enabledServices: [],
      filteredServices: [],
    };

    if (themes.length > 0) {
      themes.forEach(theme => {
        myState = toggleThemeFilter(myState, theme);
      });
    }

    // If there is a service set: reset. Otherwise use filters set by toggle theme logic
    if (services && services.length > 0) {
      myState.enabledServices = [];
    }

    if (services.length > 0) {
      services.forEach(service => {
        myState = toggleServiceFilter(myState, service);
      });
    }

    return myState;
  },
  [TOGGLE_SERVICE_FILTER]: (state, action) => toggleServiceFilter(state, action.service),
  [TOGGLE_THEME_FILTER]: (state, action) => toggleThemeFilter(state, action.theme),
};

/**
 * Services reducer
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
