import basicAuth from 'express-basic-auth';
import debugLogger from 'debug-logger';
import BPromise from 'bluebird';

import sendWeeklyNewsletter from '../send-weekly-newsletter';
import { getHighlightAreaHtmlString } from '../../weekly-notifications/feed-parser';
import { rssHighlightWeeklyUrl } from '../../../config';

const debug = debugLogger('tippiq-hood:newsletter:actions:send-weekly-newsletter');

export const authenticationMiddleware = () => basicAuth({
  users: { 'hallo dit is GAE': 'zou je de nieuwsbrief kunnen versturen?' },
  unauthorizedResponse: () => ({ success: false, message: 'Unauthorized' }),
});

export default (req, res) => {
  BPromise
    .try(() => getHighlightAreaHtmlString(rssHighlightWeeklyUrl))
    .tap(highlightContentString => {
      // Disconnect this promise chain from the main chain to be able to return quickly.
      // The results are logged when the batch completes
      BPromise
        .try(() => sendWeeklyNewsletter(highlightContentString))
        .tap(result => debug.info('%j', { success: true, result }))
        .tapCatch(err => debug.error('%j', { success: false, error: err.message }, err));
    })
    .then(() => res.status(202).json({ success: true }))
    .tapCatch(err => debug.error('%j', { success: false, error: err.message }, err))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
};
