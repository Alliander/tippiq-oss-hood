/**
 * Express Router for card actions.
 * @module cards/card-routes
 */

import { Router as expressRouter } from 'express';

import addCard from './actions/add-card';
import getCard from './actions/get-card';
import getCards from './actions/get-all-cards';
import searchCards from './actions/search-cards';
import deleteCard from './actions/delete-card';
import updateCard from './actions/update-card';

const router = expressRouter();
export { router as default };

router
  .get('/', getCards)
  .get('/:id', getCard)
  .post('/', addCard)
  .post('/search', searchCards)
  .put('/:id', updateCard)
  .delete('/:id', deleteCard);
