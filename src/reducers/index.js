import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import addressSuggestion from './addressSuggestion';
import cards from './cards';
import card from './card';
import services from './services';
import userSession from './userSession';
import appConfig from './appConfig';
import placeLocation from './placeLocation';
import contact from './contact';
import placeSettings from './placeSettings';
import newsLetter from './newsLetter';

const rootReducer = combineReducers({
  reduxAsyncConnect,
  appConfig,
  addressSuggestion,
  cards,
  card,
  services,
  userSession,
  placeLocation,
  routing: routerReducer,
  contact,
  placeSettings,
  newsLetter,
});

export default rootReducer;
